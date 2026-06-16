// const API_URL = "https://three32-server.onrender.com/api/students";
import axios from 'axios';

let API_URL =  "https://three32-server.onrender.com/api/students";

const studentService = {
  setBaseUrl: (newUrl) => {
    API_URL = newUrl;
  },
  
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (studentData) => {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    const response = await axios.put(`${API_URL}/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default studentService;