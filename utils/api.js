import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hashync.herokuapp.com',
});

export default api;