const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
// Asegúrate de que la ruta relativa sea correcta según tu estructura de carpetas
const studentRoutes = require('./routes/students'); 
// Si tienes la nueva ruta de usuarios externos, impórtala aquí también:
// const externalUserRoutes = require('./routes/externalUsers');

app.use('/api/students', studentRoutes);
// app.use('/api/external-users', externalUserRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});