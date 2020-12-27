import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.42.47:5000',
});

export default api;
