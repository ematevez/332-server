const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

/**
 * GET /api/students
 * Obtiene todos los estudiantes con paginación y filtros.
 * Equivalente SQL: SELECT * FROM students WHERE ... LIMIT ... OFFSET ...
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, course } = req.query;
    let query = {};

    // Filtro de búsqueda por nombre o email (LIKE '%search%' en SQL)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtro por curso exacto
    if (course) {
      query.course = course;
    }

    // Ejecutar consulta con paginación
    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Ordenar por más recientes primero
    
    const count = await Student.countDocuments(query);

    res.json({
      data: students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/students
 * Crea un nuevo estudiante con validaciones estrictas de duplicados.
 * Equivalente SQL: INSERT INTO students ...
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, course, age } = req.body;

    // 1. Validación manual de Email único (doble seguridad)
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'Error: El email ya está registrado.' });
    }

    // 2. Validación de combinación única: Nombre + Teléfono + Curso
    // Esto evita que alguien se inscriba dos veces al mismo curso con los mismos datos
    const existingCombination = await Student.findOne({ 
      name: name.trim(), 
      phone: phone.trim(), 
      course: course.trim() 
    });

    if (existingCombination) {
      return res.status(400).json({ 
        message: 'Error: Ya existe un estudiante con ese nombre, teléfono y curso.' 
      });
    }

    // Si pasa las validaciones, creamos el estudiante
    const student = new Student({ name, email, phone, course, age });
    await student.save();

    res.status(201).json({ message: 'Estudiante creado exitosamente', student });
  } catch (error) {
    // Manejo de errores de índices únicos de MongoDB (Código 11000)
    if (error.code === 11000) {
      // Determinar qué campo causó el duplicado basado en el mensaje de error
      const field = Object.keys(error.keyValue)[0];
      let msg = 'Datos duplicados';
      if (field === 'email') msg = 'El email ya está registrado.';
      if (field === 'name') msg = 'La combinación de nombre, teléfono y curso ya existe.';
      
      return res.status(400).json({ message: `Error: ${msg}` });
    }
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE /api/students/:id
 * Elimina un estudiante por ID.
 * Equivalente SQL: DELETE FROM students WHERE id = ...
 */
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/students/:id/toggle-active
 * Cambia el estado activo/inactivo.
 * Equivalente SQL: UPDATE students SET active = !active WHERE id = ...
 */
router.patch('/:id/toggle-active', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    student.active = !student.active;
    await student.save();
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/students/stats/summary
 * Obtiene estadísticas para el gráfico y contadores.
 * Equivalente SQL: SELECT course, COUNT(*) as count FROM students GROUP BY course
 */
router.get('/stats/summary', async (req, res) => {
  try {
    // Conteo total y por estado
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ active: true });
    
    // Agrupación por curso para el gráfico
    const coursesStats = await Student.aggregate([
      { $match: { active: true } }, // Solo contar activos para el gráfico (opcional)
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } } // Ordenar del más popular al menos popular
    ]);

    res.json({ 
      total, 
      active, 
      inactive: total - active,
      courses: coursesStats // Formato: [{ _id: "Matemáticas", count: 5 }, ...]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;