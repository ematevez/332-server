const mongoose = require('mongoose');

// DEFINICIÓN DEL ESQUEMA (Similar a CREATE TABLE en SQL)
// Aquí definimos las columnas y sus tipos de datos
const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] // NOT NULL en SQL
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, // UNIQUE INDEX en SQL
    lowercase: true // Normaliza el dato antes de guardar
  },
  age: { 
    type: Number, 
    min: [10, 'Edad mínima 10'], 
    max: [100, 'Edad máxima 100'] 
  },
  phone: String,
  course: String,
  active: { 
    type: Boolean, 
    default: true // DEFAULT TRUE en SQL
  }
}, { 
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

// Exportamos el "Modelo" (La herramienta para interactuar con la tabla)
module.exports = mongoose.model('Student', studentSchema);