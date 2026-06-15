const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// ---------------------------------------------------------
// 1. OBTENER TODOS (SELECT * FROM students)
// Soporta paginación y búsqueda (WHERE name LIKE '%search%')
// ---------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Construir la cláusula WHERE dinámica
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // LIKE '%search%' (insensible a mayúsculas)
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Ejecutar consulta con límites (LIMIT y OFFSET en SQL)
    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // ORDER BY createdAt DESC
    
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

// ---------------------------------------------------------
// 2. CREAR NUEVO (INSERT INTO students VALUES (...))
// ---------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    // Crear instancia del modelo con los datos del body
    const student = new Student(req.body);
    
    // Guardar en la base de datos
    await student.save(); 
    
    res.status(201).json({ 
      message: 'Estudiante creado con éxito',
      data: student 
    });
  } catch (error) {
    // Manejo de error de duplicados (Email único)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------------------------------------
// 3. ACTUALIZAR ESTADO (UPDATE students SET active = ... WHERE id = ...)
// ---------------------------------------------------------
router.patch('/:id/toggle-active', async (req, res) => {
  try {
    // Buscar por ID y actualizar
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Invertir el valor booleano
    student.active = !student.active;
    await student.save();

    res.json({ message: 'Estado actualizado', data: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------------------------------------
// 4. ELIMINAR (DELETE FROM students WHERE id = ...)
// ---------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------------------------------------
// 5. ESTADÍSTICAS (SELECT COUNT(*) FROM students...)
// ---------------------------------------------------------
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ active: true });
    
    res.json({ 
      total, 
      active, 
      inactive: total - active 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;