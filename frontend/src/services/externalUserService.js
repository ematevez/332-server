import axios from 'axios';

// Ajusta esta URL si estás en local o producción
const API_URL = process.env.REACT_APP_API_URL || 'https://devsapihub.com/api-users';

export const importUsers = async () => {
  const response = await axios.get(`${API_URL}/import`);
  return response.data;
};

export const getAllExternal = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const moveUser = async (id, newRole) => {
  const response = await axios.put(`${API_URL}/${id}/move`, { newRole });
  return response.data;
};

export const deleteExternal = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};