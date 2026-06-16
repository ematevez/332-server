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

  // Usamos useCallback para memorizar la función y evitar recrearla en cada render
  const loadStudents = useCallback(async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]); // Ahora es seguro incluir loadStudents en las dependencias

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
      alert('Error al guardar: ' + (error.response?.data?.message || error.message));
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
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
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
      <header className="app-header">
        <h1>Gestión de Estudiantes</h1>
      </header>

      <main className="container">
        {/* Formulario */}
        <section className="form-section card">
          <h2>{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-group">
              <label>Nombre</label>
              <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Juan Pérez" />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="juan@ejemplo.com" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="123456789" />
              </div>
              <div className="form-group">
                <label>Edad</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} required placeholder="25" />
              </div>
            </div>

            <div className="form-group">
              <label>Curso</label>
              <input name="course" value={formData.course} onChange={handleChange} required placeholder="Ej: Matemáticas Avanzadas" />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="list-section card">
          <h2>Lista de Estudiantes</h2>
          {students.length === 0 ? (
            <p className="empty-state">No hay estudiantes registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="students-table">
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
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(student)} className="btn btn-sm btn-edit">
                            Editar
                          </button>
                          <button onClick={() => handleDelete(student._id)} className="btn btn-sm btn-delete">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;