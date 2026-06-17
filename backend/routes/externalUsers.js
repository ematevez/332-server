const express = require('express');
const router = express.Router();
const axios = require('axios');
const ExternalUser = require('../models/ExternalUser');

const API_URL = 'https://devsapihub.com/api-users';

// 1. OBTENER USUARIOS DE LA API EXTERNA (Solo para mostrar en la lista temporal)
// El backend hace la petición para evitar errores de CORS/Redirección en el navegador
router.get('/list-external', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Error conectando a API externa:', error.message);
    res.status(500).json({ message: 'No se pudo conectar con la API externa.' });
  }
});

// 2. OBTENER USUARIOS GUARDADOS EN TU BASE DE DATOS
router.get('/', async (req, res) => {
  try {
    const users = await ExternalUser.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. BOTÓN GUARDAR: Guardar un usuario individual en tu DB
router.post('/save', async (req, res) => {
  try {
    const userData = req.body;
    
    // Verificar si ya existe por su ID externo
    const exists = await ExternalUser.findOne({ externalId: userData.id });
    if (exists) {
      return res.status(400).json({ message: 'Este usuario ya está guardado en tu base de datos.' });
    }

    const newUser = new ExternalUser({
      externalId: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar_url: userData.avatar_url,
      course: userData.location?.city || 'Sin asignar',
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

// 4. BOTÓN MODIFICAR: Actualizar datos de un usuario ya guardado (ej. cambiar curso)
router.put('/:id', async (req, res) => {
  try {
    const { course, name, email } = req.body; // Datos a modificar
    const updatedUser = await ExternalUser.findByIdAndUpdate(
      req.params.id,
      { course, name, email },
      { new: true }
    );
    
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado en DB' });
    
    res.json({ message: 'Usuario actualizado correctamente', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. BOTÓN BORRAR: Eliminar de tu base de datos
router.delete('/:id', async (req, res) => {
  try {
    await ExternalUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado de la base de datos' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;