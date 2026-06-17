const mongoose = require('mongoose');

const ExternalUserSchema = new mongoose.Schema({
  externalId: { type: Number, required: true, unique: true }, // ID original de la API externa
  name: String,
  email: String,
  avatar_url: String,
  course: String, // Usaremos la ciudad de la API como "curso"
  country: String,
  online: Boolean,
  last_seen: Date,
  importedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExternalUser', ExternalUserSchema);