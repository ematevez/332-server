const express = require('express');
const router = express.Router();
const axios = require('axios'); // Necesario para conectar con la API externa
const ExternalUser = require('../models/ExternalUser');

const EXTERNAL_API_URL = 'https://devsapihub.com/api-users';

// 1. IMPORTAR: Trae datos de la API externa y los guarda en tu Mongo
router.post('/import', async (req, res) => {
  try {
    console.log('Conectando a API externa...');
    const response = await axios.get(EXTERNAL_API_URL);
    const usersData = response.data;

    if (!Array.isArray(usersData)) {
      return res.status(400).json({ message: 'Formato de datos externo inválido' });
    }

    let importedCount = 0;
    let skippedCount = 0;

    for (const user of usersData) {
      // Verificar si ya existe por su ID externo
      const exists = await ExternalUser.findOne({ externalId: user.id });
      
      if (!exists) {
        await ExternalUser.create({
          externalId: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url?.trim(), // Limpiar espacios extra
          course: user.location?.city || 'Sin Asignar',
          country: user.location?.country || 'Desconocido',
          online: user.online || false,
          last_seen: user.last_seen
        });
        importedCount++;
      } else {
        skippedCount++;
      }
    }

    res.json({ 
      message: `Proceso terminado. ${importedCount} nuevos usuarios guardados. ${skippedCount} ya existían.`,
      total: usersData.length 
    });

  } catch (error) {
    console.error('Error importando:', error.message);
    res.status(500).json({ message: 'Error al conectar con la API externa o guardar en DB.' });
  }
});

// 2. LISTAR: Muestra SOLO los usuarios que ya están en tu base de datos
router.get('/', async (req, res) => {
  try {
    const users = await ExternalUser.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. MOVER: Cambia el curso de un usuario guardado
router.put('/:id/move', async (req, res) => {
  try {
    const { newCourse } = req.body;
    if (!newCourse) return res.status(400).json({ message: 'Falta el nuevo curso' });

    const updatedUser = await ExternalUser.findByIdAndUpdate(
      req.params.id,
      { course: newCourse },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado en BD' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. BORRAR: Elimina un usuario de tu base de datos
router.delete('/:id', async (req, res) => {
  try {
    await ExternalUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado de la base de datos local' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;