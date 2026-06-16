const express = require('express');
const router = express.Router();
const axios = require('axios');
const ExternalUser = require('../models/ExternalUser');

// 1. Obtener usuarios de la API externa y guardarlos en nuestra BD (Sincronizar)
router.get('/sync', async (req, res) => {
  try {
    // Traemos datos de JSONPlaceholder (API pública gratuita)
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const apiUsers = response.data;

    let importedCount = 0;

    for (const user of apiUsers) {
      // Buscamos si ya existe por su ID externo o Email
      const exists = await ExternalUser.findOne({ 
        $or: [{ externalId: user.id }, { email: user.email }] 
      });

      if (!exists) {
        await ExternalUser.create({
          externalId: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          department: 'General', // Departamento por defecto
          source:'jsonplaceholder' // Fuente de datos
        });
        importedCount++;
      }
    }

    res.json({ message: `Sincronización completa. ${importedCount} nuevos usuarios importados.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al sincronizar con API externa', error: error.message });
  }
});

// 2. Obtener todos los usuarios externos guardados en nuestra BD
router.get('/', async (req, res) => {
  try {
    const users = await ExternalUser.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Mover usuario de departamento (Curso)
router.put('/:id/move', async (req, res) => {
  const { newDepartment } = req.body;
  
  if (!newDepartment) {
    return res.status(400).json({ message: 'El nombre del nuevo departamento es requerido' });
  }

  try {
    const updatedUser = await ExternalUser.findByIdAndUpdate(
      req.params.id,
      { department: newDepartment },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: `Usuario movido a ${newDepartment}`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Eliminar usuario externo
router.delete('/:id', async (req, res) => {
  try {
    
        const deleted = await ExternalUser.findByIdAndDelete(req.params.id);
        if (!deleted) {
        return res.status(404).json({
            message: 'Usuario no encontrado'
        });
        }

        res.json({  message: 'Usuario eliminado'});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;