const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// NO usamos dotenv, ponemos la URL directa aquí
const MONGODB_URI = 'mongodb+srv://user:user@lectura.k0ihs9e.mongodb.net/qwent?retryWrites=true&w=majority';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión directa a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Conectado exitosamente'))
.catch((err) => {
  console.error('❌ Error conectando a MongoDB:', err.message);
  process.exit(1); // Detiene el servidor si no hay DB
});

// Rutas
const studentRoutes = require('./routes/students');
app.use('/api/students', studentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del Backend funcionando correctamente 🚀');
});

const externalUsersRoutes = require('./routes/externalUsers');
app.use('/api/external-users', externalUsersRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});