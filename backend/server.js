const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conexión directa a MongoDB
mongoose.connect('mongodb+srv://user:user@lectura.k0ihs9e.mongodb.net/qwent?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB Conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Rutas
const studentRoutes = require('./routes/students');
const externalUserRoutes = require('./routes/externalUsers'); // Nueva ruta

app.use('/api/students', studentRoutes);
app.use('/api/external-users', externalUserRoutes); // Nueva ruta

app.get('/', (req, res) => {
  res.send('API funcionando. Endpoints: /api/students, /api/external-users');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});