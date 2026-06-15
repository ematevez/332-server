const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number, phone: String, course: String, active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Student', studentSchema);