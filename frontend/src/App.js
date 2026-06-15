import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:4000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [form, setForm] = useState({ name: '', email: '', age: '', phone: '', course: '' });

  useEffect(() => { fetchStudents(); fetchStats(); }, []);

  const fetchStudents = async () => {
    const res = await fetch(`${API}?limit=100`);
    const data = await res.json();
    setStudents(data.data || []);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API}/stats/summary`);
    const data = await res.json();
    setStats(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', email: '', age: '', phone: '', course: '' });
    fetchStudents(); fetchStats();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchStudents(); fetchStats();
  };

  const handleToggle = async (id) => {
    await fetch(`${API}/${id}/toggle-active`, { method: 'PATCH' });
    fetchStudents(); fetchStats();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Gestión Estudiantes</h1>
        <p>Total: {stats.total} | Activos: {stats.active}</p>
      </header>
      <div className="card">
        <form onSubmit={handleSubmit} style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem'}}>
          <input className="form-control" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          <input className="form-control" placeholder="Edad" type="number" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
          <input className="form-control" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          <input className="form-control" placeholder="Curso" value={form.course} onChange={e=>setForm({...form, course:e.target.value})} />
          <button className="btn btn-primary" type="submit">Guardar</button>
        </form>
      </div>
      <div className="card">
        <h2>Listado</h2>
        {students.map(s => (
          <div key={s._id} className="student-item">
            <div>
              <strong>{s.name}</strong> <small>({s.email})</small>
              <br/>
              <span className={`badge ${s.active?'badge-active':'badge-inactive'}`}>{s.active?'Activo':'Inactivo'}</span>
            </div>
            <div className="actions">
              <button className="btn btn-secondary" onClick={()=>handleToggle(s._id)}>{s.active?'Desactivar':'Activar'}</button>
              <button className="btn btn-danger" onClick={()=>handleDelete(s._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;