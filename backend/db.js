const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://user:user@cluster0.5cff1qp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✔ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error de conexión", err);
    process.exit(1);
  }
};

module.exports = connectDB;
