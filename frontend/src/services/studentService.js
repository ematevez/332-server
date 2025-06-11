import axios from "axios";

// const API_URL = "http://localhost:4000/api/students";
const API_URL = "https://three32-server1.onrender.com/api/students";

export const getStudents = () => axios.get(API_URL);
export const createStudent = (data) => axios.post(API_URL, data);
export const updateStudent = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API_URL}/${id}`);
