const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const students = await Student.find(query).limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
    const count = await Student.countDocuments(query);
    res.json({ data: students, totalPages: Math.ceil(count / limit), currentPage: page, total: count });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) { res.status(400).json({ message: error.code === 11000 ? 'Email duplicado' : error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eliminado' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.patch('/:id/toggle-active', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if(student) { student.active = !student.active; await student.save(); res.json(student); }
    else res.status(404).json({ message: 'No encontrado' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ active: true });
    res.json({ total, active, inactive: total - active });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;