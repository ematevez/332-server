const express = require('express');
const router = express.Router();
const axios = require('axios');
const ExternalUser = require('../models/ExternalUser');

// 1. IMPORTAR usuarios desde la API externa
router.get('/import', async (req, res) => {
  try {
    const response = await axios.get('https://devsapihub.com/api/users');
    const usersToSave = response.data.map(user => ({
      externalId: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'Sin asignar',
      avatar: user.avatar
    }));

    // Guardamos uno por uno o usamos bulkWrite para evitar duplicados masivos simples
    // Aquí hacemos un upsert simple basado en externalId
    for (const user of usersToSave) {
      await ExternalUser.findOneAndUpdate(
        { externalId: user.externalId },
        user,
        { upsert: true, new: true }
      );
    }
    
    res.json({ message: 'Usuarios importados correctamente', count: usersToSave.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al importar de la API externa' });
  }
});

// 2. OBTENER todos los usuarios externos guardados
router.get('/', async (req, res) => {
  try {
    const users = await ExternalUser.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. MOVER de departamento/rol (Actualizar)
router.put('/:id/move', async (req, res) => {
  try {
    const { newRole } = req.body;
    if (!newRole) return res.status(400).json({ message: 'El nuevo rol/departamento es requerido' });

    const updatedUser = await ExternalUser.findByIdAndUpdate(
      req.params.id,
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. ELIMINAR usuario externo
router.delete('/:id', async (req, res) => {
  try {
    await ExternalUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario externo eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;