const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb+srv://user:user@cluster0.5cff1qp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    // await mongoose.connect("mongodb+srv://anibalcaeiro:WKAVCJwJheqziPgN@cluster0.g4hk2z4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    await mongoose.connect("mongodb+srv://admin:admin@test.edwyb7i.mongodb.net/?retryWrites=true&w=majority&appName=TEST");

    
    console.log("✔ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error de conexión", err);
    process.exit(1);
  }
};

module.exports = connectDB;
