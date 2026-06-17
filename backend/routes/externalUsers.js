const express = require('express');
const router = express.Router();
const axios = require('axios');
const ExternalUser = require('../models/ExternalUser');

const EXTERNAL_API_URL = 'https://devsapihub.com/api-users';

// 1. OBTENER LISTA DE USUARIOS EXTERNOS (Desde la API pública)
// El frontend llama a esto, y tu servidor va a buscar los datos.
router.get('/list-external', async (req, res) => {
  try {
    const response = await axios.get(EXTERNAL_API_URL);
    res.json(response.data);
  } catch (error) {
    console.error("Error conectando a API externa:", error.message);
    res.status(500).json({ message: 'Error al obtener usuarios externos' });
  }
});

// 2. OBTENER USUARIOS YA GUARDADOS EN TU DB
router.get('/', async (req, res) => {
  try {
    const users = await ExternalUser.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. GUARDAR UN USUARIO INDIVIDUAL EN TU DB
router.post('/save', async (req, res) => {
  try {
    const userData = req.body;
    
    // Verificar si ya existe por su ID externo
    const existing = await ExternalUser.findOne({ externalId: userData.id });
    if (existing) {
      return res.status(400).json({ message: 'Este usuario ya está guardado en tu base de datos.' });
    }

    const newUser = new ExternalUser({
      externalId: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar_url: userData.avatar_url,
      course: userData.location?.city || 'Sin Asignar',
      country: userData.location?.country || 'Desconocido',
      online: userData.online,
      last_seen: userData.last_seen
    });

    await newUser.save();
    res.json({ message: 'Usuario guardado correctamente', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. ACTUALIZAR UN USUARIO YA GUARDADO (Mover de curso o editar datos)
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await ExternalUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado en tu DB' });
    
    res.json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. ELIMINAR UN USUARIO DE TU DB
router.delete('/:id', async (req, res) => {
  try {
    await ExternalUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado de tu base de datos' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;