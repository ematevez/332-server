const mongoose = require('mongoose');

const ExternalUserSchema = new mongoose.Schema({
  externalId: { type: Number, required: true, unique: true }, // ID original de la API externa
  name: String,
  email: String,
  avatar_url: String,
  course: { type: String, default: 'Sin Asignar' }, // Campo para moverlos de curso
  country: String,
  online: Boolean,
  last_seen: Date,
  importedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExternalUser', ExternalUserSchema);