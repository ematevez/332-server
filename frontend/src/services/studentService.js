// const API_URL = "https://three32-server.onrender.com/api/students";


import axios from 'axios';

// Cambia esta URL si tu backend está en otro puerto o dominio
// const API_URL = 'http://localhost:5000/api/students'; 
// Si estás usando Render/Producción, usa: 'https://three32-server.onrender.com/api/students'
const API_URL = "https://three32-server.onrender.com/api/students";
const studentService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (studentData) => {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    // Aquí se hace la llamada PUT para modificar
    const response = await axios.put(`${API_URL}/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    // Aquí se hace la llamada DELETE para borrar
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default studentService;