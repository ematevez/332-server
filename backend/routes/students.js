const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();

const Student = mongoose.model("Student", {
  name: String,
  email: String
});

// Listar todos
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Crear estudiante con validación
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Email inválido")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email } = req.body;
    const newStudent = new Student({ name, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  }
);

// Actualizar estudiante
router.put("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Eliminar estudiante
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
