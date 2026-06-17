import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExternalUsers.css'; // Asegúrate de crear un CSS básico o usar App.css

// CAMBIA ESTO POR LA URL DE TU BACKEND EN RENDER
const API_URL = 'https://three32-server.onrender.com/api/external-users'; 

function ExternalUsers() {
  const [externalUsers, setExternalUsers] = useState([]); // Usuarios de la API externa
  const [savedUsers, setSavedUsers] = useState([]);       // Usuarios en tu MongoDB
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Traer lista de la API externa (a través de tu backend)
      const resExt = await axios.get(`${API_URL}/list-external`);
      const externalData = resExt.data;

      // 2. Traer lista de los que YA guardaste en tu DB
      const resSaved = await axios.get(API_URL);
      const savedData = resSaved.data;

      // Filtrar: Mostrar en "Disponibles" solo los que NO están en "Guardados"
      const savedIds = new Set(savedData.map(u => u.externalId));
      const available = externalData.filter(u => !savedIds.has(u.id));

      setExternalUsers(available);
      setSavedUsers(savedData);
    } catch (error) {
      console.error(error);
      setMsg('Error cargando datos. Revisa los logs del backend.');
    }
    setLoading(false);
  };

  // Acción: Guardar uno individual
  const handleSave = async (user) => {
    try {
      await axios.post(`${API_URL}/save`, user);
      setMsg(`✅ ${user.name} guardado en tu base de datos.`);
      loadData(); // Recargar listas
    } catch (error) {
      setMsg('❌ Error al guardar: ' + (error.response?.data?.message || error.message));
    }
  };

  // Acción: Borrar de tu DB
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario de tu base de datos?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMsg('Usuario eliminado.');
      loadData();
    } catch (error) {
      setMsg('Error al eliminar.');
    }
  };

  // Acción: Mover de curso (Editar simple)
  const handleMoveCourse = async (id, newCourse) => {
    try {
      await axios.put(`${API_URL}/${id}`, { course: newCourse });
      setMsg('Curso actualizado.');
      loadData();
    } catch (error) {
      setMsg('Error al actualizar.');
    }
  };

  return (
    <div className="external-users-container">
      <h1>Gestión de Usuarios Externos</h1>
      {msg && <div className="alert">{msg}</div>}
      
      {loading ? <p>Cargando datos...</p> : (
        <div className="lists-wrapper">
          
          {/* LISTA 1: DISPONIBLES EN API (Para Guardar) */}
          <div className="list-section">
            <h2>📥 Disponibles en API (No guardados)</h2>
            <p>Selecciona qué usuarios traer a tu base de datos.</p>
            <div className="cards-grid">
              {externalUsers.length === 0 ? <p>No hay usuarios nuevos disponibles.</p> : null}
              
              {externalUsers.map(user => (
                <div key={user.id} className="card">
                  <img src={user.avatar_url} alt={user.name} className="avatar" />
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>País:</strong> {user.location?.country}</p>
                  <p><strong>Ciudad:</strong> {user.location?.city}</p>
                  <button onClick={() => handleSave(user)} className="btn-save">
                    💾 Guardar en Cluster
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LISTA 2: YA GUARDADOS EN TU DB (Para Editar/Borrar) */}
          <div className="list-section">
            <h2>💾 Guardados en tu Base de Datos</h2>
            <p>Estos usuarios ya están en tu colección MongoDB.</p>
            <div className="cards-grid">
              {savedUsers.length === 0 ? <p>No has guardado ningún usuario aún.</p> : null}

              {savedUsers.map(user => (
                <div key={user._id} className="card saved">
                  <img src={user.avatar_url} alt={user.name} className="avatar" />
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  
                  <div className="action-row">
                    <label>Curso/Ciudad:</label>
                    <select 
                      value={user.course} 
                      onChange={(e) => handleMoveCourse(user._id, e.target.value)}
                    >
                      <option value="Sin Asignar">Sin Asignar</option>
                      <option value="New York">New York</option>
                      <option value="London">London</option>
                      <option value="Bogota">Bogota</option>
                      <option value="Paris">Paris</option>
                    </select>
                  </div>

                  <button onClick={() => handleDelete(user._id)} className="btn-delete">
                    🗑️ Borrar de DB
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default ExternalUsers;