const mongoose = require('mongoose');

const ExternalUserSchema = new mongoose.Schema({
  externalId: { type: Number, required: true }, // ID original de la API externa
  name: String,
  email: String,
  phone: String,
  avatar_url: String,
  course: { type: String, default: 'Sin Asignar' }, // Lo usaremos como "Ciudad/Curso"
  country: String,
  online: Boolean,
  last_seen: Date,
  importedAt: { type: Date, default: Date.now }
});

// Índice para saber si ya guardamos ese usuario externo
ExternalUserSchema.index({ externalId: 1 }, { unique: true });

module.exports = mongoose.model('ExternalUser', ExternalUserSchema);