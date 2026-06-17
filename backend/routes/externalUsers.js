const express = require('express');
const router = express.Router();
const axios = require('axios');
const ExternalUser = require('../models/ExternalUser');

const EXTERNAL_API_URL = 'https://devsapihub.com/api-users';

// 1. Importar usuarios desde la API externa a tu DB
router.post('/import', async (req, res) => {
  try {
    const response = await axios.get(EXTERNAL_API_URL);
    const usersData = response.data;

    if (!Array.isArray(usersData)) {
      return res.status(400).json({ message: 'La API externa no devolvió una lista válida' });
    }

    let importedCount = 0;

    for (const user of usersData) {
      // Verificar si ya existe para no duplicar
      const exists = await ExternalUser.findOne({ externalId: user.id });
      
      if (!exists) {
        await ExternalUser.create({
          externalId: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          course: user.location?.city || 'Sin asignar', // La ciudad actúa como curso
          country: user.location?.country || 'Desconocido',
          online: user.online || false,
          last_seen: user.last_seen
        });
        importedCount++;
      }
    }

    res.json({ 
      message: `Importación completada. ${importedCount} nuevos usuarios guardados.`, 
      total: usersData.length 
    });
  } catch (error) {
    console.error('Error importando usuarios:', error.message);
    res.status(500).json({ message: 'Error al conectar con la API externa o guardar datos.' });
  }
});

// 2. Obtener usuarios guardados en TU base de datos
router.get('/', async (req, res) => {
  try {
    const users = await ExternalUser.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Mover usuario de curso (actualizar ciudad)
router.put('/:id/move', async (req, res) => {
  try {
    const { newCourse } = req.body;
    if (!newCourse) return res.status(400).json({ message: 'Se requiere el nuevo curso' });

    const updatedUser = await ExternalUser.findByIdAndUpdate(
      req.params.id,
      { course: newCourse },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado en BD local' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Eliminar usuario local
router.delete('/:id', async (req, res) => {
  try {
    await ExternalUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado de la base de datos local' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;