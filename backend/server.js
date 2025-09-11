// npm init -y
// npm install express mongoose cors express-validator
// testeo para que se use CI/CD
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/students", require("./routes/students"));

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
