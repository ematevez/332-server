import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Usa la URL de tu backend en Render (ej: https://three32-server.onrender.com/api/external-users)
const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/external-users` : 'http://localhost:5000/api/external-users';

function ExternalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Cursos disponibles para mover
  const courses = ['Sin Asignar', 'New York', 'London', 'Bogota', 'Paris', 'Tokyo', 'Berlin'];

  useEffect(() => {
    loadLocalUsers();
  }, []);

  const loadLocalUsers = async () => {
    setLoading(true);
    try {
      // Solo trae los que YA están en TU base de datos
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (error) {
      setMsg('Error cargando usuarios locales.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleImport = async () => {
    setLoading(true);
    setMsg('Conectando con API externa y guardando en tu BD...');
    try {
      // Llama al backend para que él haga el fetch y el save
      const res = await axios.post(`${API_URL}/import`);
      setMsg(res.data.message);
      loadLocalUsers(); // Recargar lista con los nuevos datos
    } catch (error) {
      setMsg('Error al importar. Revisa los logs del backend.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleMove = async (id, newCourse) => {
    try {
      await axios.put(`${API_URL}/${id}/move`, { newCourse });
      setMsg(`Usuario movido a ${newCourse}`);
      loadLocalUsers();
    } catch (error) {
      setMsg('Error al mover usuario.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario de tu base de datos?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMsg('Usuario eliminado.');
      loadLocalUsers();
    } catch (error) {
      setMsg('Error al eliminar.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Gestión de Usuarios Externos</h2>
      <p>Estos son los usuarios guardados en <strong>tu colección MongoDB</strong>.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleImport} disabled={loading} style={btnStyle}>
          {loading ? 'Procesando...' : '📥 Importar desde API Externa'}
        </button>
        {msg && <p style={{ color: '#0066cc', fontWeight: 'bold' }}>{msg}</p>}
      </div>

      {loading && !msg ? <p>Cargando...</p> : null}

      {!loading && users.length === 0 ? (
        <p>No hay usuarios en la base de datos. Haz clic en "Importar" para traerlos.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {users.map(user => (
            <div key={user._id} style={cardStyle}>
              <img src={user.avatar_url} alt={user.name} style={imgStyle} onError={(e) => e.target.src='https://via.placeholder.com/100'} />
              <h3>{user.name}</h3>
              <p><small>{user.email}</small></p>
              <p><strong>País:</strong> {user.country}</p>
              <p><strong>Curso Actual:</strong> {user.course}</p>
              
              <div style={{ marginTop: '10px' }}>
                <label style={{ fontSize: '12px' }}>Mover a: </label>
                <select 
                  value={user.course} 
                  onChange={(e) => handleMove(user._id, e.target.value)}
                  style={selectStyle}
                >
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button onClick={() => handleDelete(user._id)} style={deleteBtnStyle}>
                🗑️ Eliminar de BD
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Estilos simples en línea
const btnStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' };
const deleteBtnStyle = { marginTop: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', width: '100%' };
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' };
const imgStyle = { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' };
const selectStyle = { width: '100%', padding: '5px', marginTop: '5px' };

export default ExternalUsers;