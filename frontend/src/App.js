import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await studentService.update(editingId, formData);
        alert('Estudiante actualizado');
        setEditingId(null);
      } else {
        await studentService.create(formData);
        alert('Estudiante creado');
      }
      setFormData({ name: '', email: '', phone: '', course: '', age: '' });
      loadStudents();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
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
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', email: '', phone: '', course: '', age: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar?')) {
      try {
        await studentService.delete(id);
        alert('Eliminado');
        loadStudents();
        if (editingId === id) handleCancelEdit();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Estudiantes</h1>

      <div className="form-container">
        <h2>{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
          <input name="course" placeholder="Curso" value={formData.course} onChange={handleChange} required />
          <input name="age" type="number" placeholder="Edad" value={formData.age} onChange={handleChange} required />
          
          <div className="button-group">
            <button type="submit" className="btn-save">
              {editingId ? 'Actualizar' : 'Guardar'}
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
        <h2>Lista de Estudiantes</h2>
        {students.length === 0 ? (
          <p>No hay estudiantes.</p>
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
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td>{student.age}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(student)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(student._id)} className="btn-delete">
                      Eliminar
                    </button>
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