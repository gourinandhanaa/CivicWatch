// utils/axiosConfig.js
import axios from 'axios';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Set initial token if exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default axios;
