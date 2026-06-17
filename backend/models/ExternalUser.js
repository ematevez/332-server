const mongoose = require('mongoose');

const externalUserSchema = new mongoose.Schema({
  externalId: { type: Number, required: true, unique: true }, // ID original de la API externa
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Developer' }, // Esto actuará como el "curso/departamento"
  avatar: { type: String },
  importedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExternalUser', externalUserSchema);