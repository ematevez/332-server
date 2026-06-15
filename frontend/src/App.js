import React, { useState, useEffect } from 'react';
import './App.css';

// CONFIGURACIÓN DE LA API
// NOTA: En producción (Netlify), cambia esto por la URL de tu backend en Render/Railway
const API_URL = 'http://localhost:4000/api/students';

function App() {
  // --- ESTADOS (Variables reactivas) ---
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    course: ''
  });

  // --- EFECTOS (Se ejecutan al cargar la página) ---
  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  // --- FUNCIONES DE OBTENCIÓN DE DATOS (SELECT) ---
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}?limit=100`);
      const data = await res.json();
      setStudents(data.data || []);
    } catch (err) {
      console.error("Error cargando estudiantes", err);
      alert("No se pudo conectar con el servidor");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats/summary`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error stats", err);
    }
  };

  // --- MANEJO DEL FORMULARIO (INSERT) ---
  const handleChange = (e) => {
    // Actualiza el estado local cuando el usuario escribe
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);

    try {
      // Envío de datos al backend (POST)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar');
      }

      // Éxito: Limpiar formulario y recargar lista
      alert('✅ Estudiante guardado correctamente');
      setFormData({ name: '', email: '', age: '', phone: '', course: '' });
      fetchStudents();
      fetchStats();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- ACCIONES SOBRE LA LISTA (DELETE / UPDATE) ---
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este estudiante?')) return;
    
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchStudents();
      fetchStats();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/toggle-active`, { method: 'PATCH' });
      fetchStudents();
      fetchStats();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  // --- RENDERIZADO (HTML/JSX) ---
  return (
    <div className="app-container">
      <header className="header">
        <h1>🎓 Gestión de Estudiantes</h1>
        <div className="stats-bar">
          <span className="stat-item">Total: <strong>{stats.total}</strong></span>
          <span className="stat-item active">Activos: <strong>{stats.active}</strong></span>
          <span className="stat-item inactive">Inactivos: <strong>{stats.inactive}</strong></span>
        </div>
      </header>

      {/* TARJETA DEL FORMULARIO */}
      <div className="card form-card">
        <h2>Nuevo Estudiante</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid-form">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                className="form-control" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Ej: Juan Pérez"
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                className="form-control" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="juan@ejemplo.com"
                required 
              />
            </div>
            <div className="form-group">
              <label>Edad</label>
              <input 
                className="form-control" 
                name="age" 
                type="number" 
                value={formData.age} 
                onChange={handleChange} 
                placeholder="Ej: 25"
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                className="form-control" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+54 9 11..."
              />
            </div>
            <div className="form-group">
              <label>Curso</label>
              <input 
                className="form-control" 
                name="course" 
                value={formData.course} 
                onChange={handleChange} 
                placeholder="Ej: Desarrollo Web"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : '💾 Guardar Estudiante'}
          </button>
        </form>
      </div>

      {/* TARJETA DE LA LISTA */}
      <div className="card">
        <h2>Listado de Estudiantes</h2>
        {students.length === 0 ? (
          <p style={{textAlign: 'center', color: '#888'}}>No hay estudiantes registrados.</p>
        ) : (
          <div className="student-list">
            {students.map(student => (
              <div key={student._id} className="student-item">
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p className="student-details">
                    📧 {student.email} &nbsp;|&nbsp; 
                    📚 {student.course || 'Sin curso'} &nbsp;|&nbsp; 
                    🎂 {student.age ? `${student.age} años` : ''}
                  </p>
                  <span className={`badge ${student.active ? 'badge-active' : 'badge-inactive'}`}>
                    {student.active ? '🟢 Activo' : '🔴 Inactivo'}
                  </span>
                </div>
                <div className="actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleToggleActive(student._id)}
                    title={student.active ? "Desactivar" : "Activar"}
                  >
                    {student.active ? '⏸️' : '▶️'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(student._id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;