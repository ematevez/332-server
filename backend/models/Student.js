const mongoose = require('mongoose');

// Definición del Esquema (Similar a CREATE TABLE en SQL)
const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'], 
    unique: true, // Esto crea un índice único en la DB (como UNIQUE en SQL)
    lowercase: true,
    trim: true 
  },
  age: { 
    type: Number, 
    min: [10, 'La edad mínima es 10'], 
    max: [100, 'La edad máxima es 100'] 
  },
  phone: { 
    type: String, 
    required: [true, 'El teléfono es obligatorio'],
    trim: true 
  },
  course: { 
    type: String, 
    required: [true, 'El curso es obligatorio'],
    trim: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true // Agrega automáticamente createdAt y updatedAt
});

// Índice compuesto para validar duplicados de Nombre+Teléfono+Curso a nivel de base de datos
// Similar a UNIQUE(name, phone, course) en SQL
studentSchema.index({ name: 1, phone: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);