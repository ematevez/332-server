import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Reutilizamos los estilos

const API_URL = 'https://devsapihub.com/api-users';

function ExternalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moveTarget, setMoveTarget] = useState({}); // Para guardar el input de destino por ID

  const loadUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (error) {
      alert('Error cargando usuarios externos');
    }
  };

  const syncWithApi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/sync`);
      alert(res.data.message);
      loadUsers();
    } catch (error) {
      alert('Error sincronizando');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (id) => {
    const newDept = moveTarget[id];
    if (!newDept) return alert('Escribe un nombre de departamento');

    try {
      await axios.put(`${API_URL}/${id}/move`, { newDepartment: newDept });
      alert(`Usuario movido a ${newDept}`);
      setMoveTarget({ ...moveTarget, [id]: '' }); // Limpiar input
      loadUsers();
    } catch (error) {
      alert('Error al mover usuario');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("¿Borrar este usuario local?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      loadUsers();
    } catch (error) {
      alert("Error al borrar");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌍 Usuarios Externos (API)</h1>
        <p>Importa usuarios de JSONPlaceholder y gestiona sus departamentos</p>
      </header>

      <div className="main-content">
        <section className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2>Base de Datos Local</h2>
            <button onClick={syncWithApi} disabled={loading} className="btn btn-primary">
              {loading ? 'Sincronizando...' : '🔄 Importar desde API Externa'}
            </button>
          </div>
          
          {users.length === 0 ? (
            <p className="empty-state">No hay usuarios importados. Haz clic en "Importar" para traer datos.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Usuario</th>
                    <th>Departamento Actual</th>
                    <th>Mover a...</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>@{user.username}</td>
                      <td><span className="course-tag">{user.department}</span></td>
                      <td>
                        <div style={{display:'flex', gap:'5px'}}>
                          <input 
                            type="text" 
                            placeholder="Nuevo Dept" 
                            value={moveTarget[user._id] || ''}
                            onChange={(e) => setMoveTarget({...moveTarget, [user._id]: e.target.value})}
                            style={{padding:'5px', borderRadius:'4px', border:'1px solid #ddd'}}
                          />
                          <button onClick={() => handleMove(user._id)} className="btn btn-primary" style={{padding:'5px 10px', fontSize:'0.8rem'}}>
                            Mover
                          </button>
                        </div>
                      </td>
                      <td>
                         <button onClick={() => handleDelete(user._id)} className="btn-icon btn-delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ExternalUsers;