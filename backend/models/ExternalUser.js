const mongoose = require('mongoose');

const ExternalUserSchema = new mongoose.Schema({
  externalId: { type: Number, required: true, unique: true }, // ID de la API externa
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  department: { type: String, default: 'Sin Asignar' }, // Equivalente a "curso" para moverlos
  source: { type: String, default: 'jsonplaceholder' }
}, { timestamps: true });

module.exports = mongoose.model('ExternalUser', ExternalUserSchema);