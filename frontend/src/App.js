import React, { useState, useEffect, useCallback } from 'react';
import studentService from './services/studentService';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    age: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detectar si estamos en producción para usar la URL correcta
  const isProduction = window.location.hostname !== 'localhost';
  const API_BASE = isProduction 
    ? 'https://three32-server.onrender.com/api/students' 
    : 'http://localhost:5000/api/students';

  // Sobrescribir la URL del servicio dinámicamente
  studentService.setBaseUrl(API_BASE);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      alert("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await studentService.update(editingId, formData);
        alert('Estudiante actualizado correctamente');
        setEditingId(null);
      } else {
        await studentService.create(formData);
        alert('Estudiante creado correctamente');
      }
      
      setFormData({ name: '', email: '', phone: '', course: '', age: '' });
      loadStudents();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert('Error al guardar: ' + msg);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      age: student.age
    });
    setEditingId(student._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', email: '', phone: '', course: '', age: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
      try {
        await studentService.delete(id);
        alert('Estudiante eliminado');
        loadStudents();
        if (editingId === id) handleCancelEdit();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Estudiantes PAKI</h1>

      <div className="form-container">
        <h2>{editingId ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
          <input name="course" placeholder="Curso / Especialidad" value={formData.course} onChange={handleChange} required />
          <input name="age" type="number" placeholder="Edad" value={formData.age} onChange={handleChange} required />
          
          <div className="button-group">
            <button type="submit" className="btn-save">
              {editingId ? 'Actualizar Datos' : 'Guardar Estudiante'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-container">
        <h2>📋 Lista de Estudiantes</h2>
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Cargando datos...</p>
        ) : students.length === 0 ? (
          <p style={{textAlign: 'center', color: '#6b7280'}}>No hay estudiantes registrados aún.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Curso</th>
                <th>Edad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td>{student.age}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(student)} className="btn-edit">Editar</button>
                    <button onClick={() => handleDelete(student._id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;