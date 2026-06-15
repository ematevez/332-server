import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './App.css';

// URL de tu API. 
// NOTA: En producción (Netlify), cambia esto por la URL de tu backend en Render/Railway.
const API_URL = 'http://localhost:4000/api/students';

function App() {
  // Estados para los datos
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, courses: [] });
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    course: ''
  });

  // Estados para feedback visual (alertas y carga)
  const [message, setMessage] = useState({ text: '', type: '' }); // 'success' o 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  // Función unificada para cargar estudiantes y estadísticas
  const fetchData = async () => {
    try {
      // 1. Obtener lista de estudiantes (SELECT * FROM students)
      const resStudents = await fetch(`${API_URL}?limit=100`);
      const dataStudents = await resStudents.json();
      setStudents(dataStudents.data || []);

      // 2. Obtener estadísticas para el gráfico (SELECT course, COUNT(*) GROUP BY course)
      const resStats = await fetch(`${API_URL}/stats/summary`);
      const dataStats = await resStats.json();
      setStats(dataStats);

      setLoading(false);
    } catch (err) {
      setMessage({ text: 'Error al conectar con el servidor.', type: 'error' });
      setLoading(false);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar mensajes cuando el usuario escribe
    if (message.text) setMessage({ text: '', type: '' });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Validación previa en frontend (opcional pero recomendada para UX)
      if (!formData.email.includes('@')) {
        throw new Error('El email no es válido.');
      }

      // Petición POST (INSERT INTO students)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        // El backend envía mensajes específicos de duplicados
        throw new Error(result.message || 'Error al guardar');
      }

      // Éxito
      setMessage({ text: '¡Estudiante registrado correctamente!', type: 'success' });
      setFormData({ name: '', email: '', age: '', phone: '', course: '' }); // Limpiar form
      fetchData(); // Recargar lista y gráfico

    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar estudiante (DELETE FROM students WHERE id = ...)
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este estudiante?')) return;
    
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      
      setMessage({ text: 'Estudiante eliminado.', type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  // Alternar estado activo/inactivo (UPDATE students SET active = ...)
  const handleToggleActive = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle-active`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Error al actualizar estado');
      
      fetchData();
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  if (loading) return <div className="loading" style={{textAlign:'center', color:'white', padding:'2rem'}}>Cargando datos...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Gestión de Estudiantes</h1>
        <p>Total: {stats.total} | Activos: {stats.active} | Inactivos: {stats.inactive}</p>
      </header>

      {/* Formulario de Registro */}
      <div className="card">
        <h2>Nuevo Estudiante</h2>
        
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
              <label>Email (Único)</label>
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
              <label>Teléfono</label>
              <input 
                className="form-control" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Ej: 11223344"
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
                min="10" max="100"
              />
            </div>

            <div className="form-group">
              <label>Curso</label>
              <input 
                className="form-control" 
                name="course" 
                value={formData.course} 
                onChange={handleChange} 
                placeholder="Ej: Matemáticas"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Estudiante'}
          </button>
        </form>
      </div>

      {/* Lista de Estudiantes */}
      <div className="card">
        <h2>Listado de Estudiantes</h2>
        {students.length === 0 ? (
          <p style={{textAlign:'center', color:'#888'}}>No hay estudiantes registrados.</p>
        ) : (
          <div className="student-list">
            {students.map(student => (
              <div key={student._id} className="student-item">
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>
                    📧 {student.email} | 📞 {student.phone} | 🎓 {student.course}
                    {student.age ? ` | ${student.age} años` : ''}
                  </p>
                  <span className={`badge ${student.active ? 'badge-active' : 'badge-inactive'}`}>
                    {student.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleToggleActive(student._id)}
                  >
                    {student.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(student._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico Estadístico */}
      <div className="card">
        <h2>Estadísticas por Curso</h2>
        {stats.courses && stats.courses.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats.courses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" label={{ value: 'Curso', position: 'insideBottom', offset: -5 }} />
                <YAxis allowDecimals={false} label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f0f0f0' }}
                />
                <Bar dataKey="count" name="Estudiantes" radius={[8, 8, 0, 0]}>
                  {stats.courses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#667eea', '#764ba2', '#f093fb', '#f5576c'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{textAlign:'center', color:'#888'}}>No hay datos suficientes para mostrar el gráfico.</p>
        )}
      </div>
    </div>
  );
}

export default App;