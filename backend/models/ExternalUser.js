const mongoose = require('mongoose');

const ExternalUserSchema = new mongoose.Schema({
  externalId: { type: Number, required: true, unique: true }, // ID original de la API
  name: String,
  email: String,
  phone: String,
  avatar_url: String,
  course: String, // Lo usaremos como "Departamento" o "Curso"
  country: String,
  online: Boolean,
  last_seen: Date
});

module.exports = mongoose.model('ExternalUser', ExternalUserSchema);