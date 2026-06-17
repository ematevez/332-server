const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      // 'mongodb+srv://user:user@lectura.k0ihs9e.mongodb.net/qwent?retryWrites=true&w=majority',
      "mongodb+srv://user:user@clusterdeprueba.qbcnna9.mongodb.net/?appName=ClusterDePrueba",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
