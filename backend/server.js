// npm init -y
// npm install express mongoose cors express-validator

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/students", require("./routes/students"));

const PORT = process.env.PORT || 4000;
