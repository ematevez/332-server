import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Asegúrate de tener estilos básicos

// CAMBIA ESTO POR LA URL DE TU BACKEND EN RENDER
const API_BASE = 'https://three32-server.onrender.com/api/external-users'; 

function ExternalUsers() {
  const [externalUsers, setExternalUsers] = useState([]); // Usuarios de la API (temporales)
  const [savedUsers, setSavedUsers] = useState([]);       // Usuarios en tu DB
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Cargar listas al iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Traer usuarios de la API externa (vía tu backend)
      const extRes = await axios.get(`${API_BASE}/list-external`);
      setExternalUsers(extRes.data);

      // 2. Traer usuarios guardados en tu DB
      const savedRes = await axios.get(`${API_BASE}`);
      setSavedUsers(savedRes.data);
    } catch (error) {
      setMsg('Error cargando datos: ' + error.message);
    }
    setLoading(false);
  };

  // --- ACCIONES DE LOS 3 BOTONES ---

  // BOTÓN 1: GUARDAR EN CLUSTER
  const handleSave = async (user) => {
    try {
      await axios.post(`${API_BASE}/save`, user);
      setMsg(`✅ ${user.name} guardado en la base de datos.`);
      loadAllData(); // Recargar para actualizar listas
    } catch (error) {
      setMsg('❌ Error al guardar: ' + (error.response?.data?.message || error.message));
    }
  };

  // BOTÓN 2: MODIFICAR Y GUARDAR (Ejemplo: Cambiar Curso/Departamento)
  const handleModify = async (user) => {
    const newCourse = prompt(`Modificar curso/departamento para ${user.name}:`, user.course);
    if (newCourse && newCourse !== user.course) {
      try {
        await axios.put(`${API_BASE}/${user._id}`, { course: newCourse });
        setMsg(`✏️ ${user.name} actualizado a "${newCourse}".`);
        loadAllData();
      } catch (error) {
        setMsg('❌ Error al modificar: ' + error.message);
      }
    }
  };

  // BOTÓN 3: BORRAR DE LA LISTA (DB)
  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario de tu base de datos?')) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        setMsg('🗑️ Usuario eliminado.');
        loadAllData();
      } catch (error) {
        setMsg('❌ Error al borrar: ' + error.message);
      }
    }
  };

  // Helper para saber si un usuario externo ya está guardado
  const isSaved = (extId) => savedUsers.some(u => u.externalId === extId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios Externos</h1>
      {msg && <div className="bg-blue-100 p-2 mb-4 rounded">{msg}</div>}
      
      {loading && <p>Cargando datos...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA 1: USUARIOS DISPONIBLES (API) */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Disponibles en API</h2>
          <div className="space-y-4">
            {externalUsers.map(user => {
              const alreadySaved = isSaved(user.id);
              return (
                <div key={user.id} className="border p-3 rounded shadow bg-white flex items-center gap-4">
                  <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email} - {user.location?.city}</p>
                  </div>
                  
                  {/* BOTÓN 1: GUARDAR */}
                  {alreadySaved ? (
                    <span className="text-green-600 text-sm font-bold">Ya guardado</span>
                  ) : (
                    <button 
                      onClick={() => handleSave(user)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      💾 Guardar en DB
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2: USUARIOS GUARDADOS (TU DB) */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Guardados en tu Cluster</h2>
          <div className="space-y-4">
            {savedUsers.map(user => (
              <div key={user._id} className="border p-3 rounded shadow bg-gray-50 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-600">Curso: <span className="font-mono bg-yellow-200 px-1 rounded">{user.course}</span></p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  {/* BOTÓN 2: MODIFICAR */}
                  <button 
                    onClick={() => handleModify(user)}
                    className="flex-1 bg-orange-500 text-white px-2 py-1 rounded text-sm hover:bg-orange-600"
                  >
                    ✏️ Modificar
                  </button>
                  
                  {/* BOTÓN 3: BORRAR */}
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                  >
                    🗑️ Borrar
                  </button>
                </div>
              </div>
            ))}
            {savedUsers.length === 0 && <p className="text-gray-500 italic">No hay usuarios guardados aún.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExternalUsers;