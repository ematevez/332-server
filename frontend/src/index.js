import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import ExternalUsers from './ExternalUsers';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <nav style={{background:'#333', padding:'1rem', textAlign:'center'}}>
        <Link to="/" style={{color:'white', marginRight:'20px', textDecoration:'none', fontWeight:'bold'}}>🎓 Estudiantes 1</Link>
        <Link to="/externos" style={{color:'white', textDecoration:'none', fontWeight:'bold'}}>🌍 Usuarios Externos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/externos" element={<ExternalUsers />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);