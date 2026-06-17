import React, { useState, useEffect } from 'react';
import { importUsers, getAllExternal, moveUser, deleteExternal } from '../services/externalUserService';
import './ExternalUsers.css'; // Puedes copiar el CSS de App.css y adaptarlo

function ExternalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    const data = await getAllExternal();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleImport = async () => {
    setLoading(true);
    try {
      await importUsers();
      alert('Usuarios importados desde la API externa!');
      loadUsers();
    } catch (error) {
      alert('Error al importar');
    }
    setLoading(false);
  };

  const handleMove = async (id) => {
    const newRole = prompt("Ingresa el nuevo Departamento/Rol para mover al usuario:");
    if (newRole) {
      try {
        await moveUser(id, newRole);
        alert('Usuario movido correctamente');
        loadUsers();
      } catch (error) {
        alert('Error al mover usuario');
      }
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Eliminar este usuario externo?")) {
      await deleteExternal(id);
      loadUsers();
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Usuarios Externos (API Demo)</h2>
      <button onClick={handleImport} disabled={loading} className="btn-import">
        {loading ? 'Importando...' : '📥 Importar desde API Externa'}
      </button>

      <div className="grid-users">
        {users.map(user => (
          <div key={user._id} className="card-user">
            <img src={user.avatar || 'https://via.placeholder.com/50'} alt={user.name} className="avatar" />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p><strong>Depto:</strong> {user.role}</p>
            
            <div className="actions">
              <button onClick={() => handleMove(user._id)} className="btn-move">Mover</button>
              <button onClick={() => handleDelete(user._id)} className="btn-delete">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExternalUsers;