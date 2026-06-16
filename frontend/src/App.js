import React, { useState, useEffect } from 'react';
import studentService from './services/studentService';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: '', age: '' });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      showNotification('Error al cargar estudiantes', 'error');
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
        showNotification('Estudiante actualizado correctamente');
        setEditingId(null);
      } else {
        await studentService.create(formData);
        showNotification('Estudiante creado correctamente');
      }
      setFormData({ name: '', email: '', phone: '', course: '', age: '' });
      loadStudents();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error al guardar', 'error');
    }
  };

  const handleEdit = (student) => {
    setFormData({ name: student.name, email: student.email, phone: student.phone, course: student.course, age: student.age });
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
        showNotification('Estudiante eliminado');
        loadStudents();
        if (editingId === id) handleCancelEdit();
      } catch (error) {
        showNotification('Error al eliminar', 'error');
      }
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎓 Gestión Académica</h1>
        <p>Administra tus estudiantes de forma eficiente</p>
      </header>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="main-content">
        {/* Formulario */}
        <section className="card form-section">
          <h2>{editingId ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Nombre Completo</label>
                <input name="name" placeholder="Ej. Juan Pérez" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input name="email" type="email" placeholder="juan@ejemplo.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Teléfono</label>
                <input name="phone" placeholder="+54 9 11..." value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Curso / Carrera</label>
                <input name="course" placeholder="Ej. Ingeniería" value={formData.course} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Edad</label>
                <input name="age" type="number" placeholder="20" value={formData.age} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="actions-bar">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar Datos' : 'Guardar Estudiante'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="card list-section">
          <div className="list-header">
            <h2>📋 Listado de Estudiantes</h2>
            <span className="badge">{students.length} Registrados</span>
          </div>
          
          {students.length === 0 ? (
            <div className="empty-state">
              <p>No hay estudiantes registrados aún.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Curso</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="user-info">
                          <strong>{student.name}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span>📧 {student.email}</span>
                          <span>📱 {student.phone}</span>
                        </div>
                      </td>
                      <td><span className="course-tag">{student.course}</span></td>
                      <td>{student.age} años</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(student)} className="btn-icon btn-edit" title="Editar">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(student._id)} className="btn-icon btn-delete" title="Eliminar">
                            🗑️
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
      </div>
      
      <footer className="app-footer">
        <p>Sistema de Gestión v2.0 | UX Mejorada</p>
      </footer>
    </div>
  );
}

export default App;