import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Cambia esta URL por la de tu backend en Render cuando despliegues
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/external-users';

function ExternalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cursos disponibles para mover
  const courses = ['New York', 'London', 'Bogota', 'Paris', 'Tokyo', 'Sin Asignar'];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      setMessage('Error cargando usuarios locales.');
    }
    setLoading(false);
  };

  const handleImport = async () => {
    setLoading(true);
    setMessage('Importando desde API externa...');
    try {
      // Llamada POST a tu backend para que él consulte la API externa
      const res = await axios.post(`${API_URL}/import`);
      setMessage(res.data.message);
      loadUsers();
    } catch (error) {
      setMessage('Error al importar. Verifica que el backend tenga axios instalado.');
    }
    setLoading(false);
  };

  const handleMoveCourse = async (id, newCourse) => {
    try {
      await axios.put(`${API_URL}/${id}/move`, { newCourse });
      setMessage(`Usuario movido a ${newCourse}`);
      loadUsers();
    } catch (error) {
      setMessage('Error al mover usuario.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("¿Eliminar este usuario de tu BD local?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Usuario eliminado.');
      loadUsers();
    } catch (error) {
      setMessage('Error al eliminar.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Usuarios Externos (DevsApiHub)</h2>
      
      <div style={styles.controls}>
        <button onClick={handleImport} disabled={loading} style={styles.btnPrimary}>
          {loading ? 'Procesando...' : '📥 Importar Usuarios de API'}
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </div>

      {loading && !message ? <p>Cargando...</p> : (
        <div style={styles.grid}>
          {users.map(user => (
            <div key={user._id} style={styles.card}>
              <img src={user.avatar_url} alt={user.name} style={styles.avatar} />
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>País:</strong> {user.country}</p>
              
              <div style={styles.actionRow}>
                <label style={styles.label}>Curso (Ciudad):</label>
                <select 
                  value={user.course} 
                  onChange={(e) => handleMoveCourse(user._id, e.target.value)}
                  style={styles.select}
                >
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button onClick={() => handleDelete(user._id)} style={styles.btnDelete}>
                Eliminar Local
              </button>
            </div>
          ))}
        </div>
      )}
      
      {users.length === 0 && !loading && (
        <p style={{textAlign: 'center', color: '#666'}}>
          No hay usuarios importados aún. Haz clic en "Importar" para traerlos.
        </p>
      )}
    </div>
  );
}

// Estilos simples en JS
const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { textAlign: 'center', color: '#333' },
  controls: { textAlign: 'center', marginBottom: '20px' },
  btnPrimary: { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  message: { marginTop: '10px', fontWeight: 'bold', color: '#28a745' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' },
  actionRow: { margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', fontWeight: 'bold' },
  select: { padding: '5px', borderRadius: '4px' },
  btnDelete: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%' }
};

export default ExternalUsers;