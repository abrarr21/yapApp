import axios from 'axios';

const globalApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default globalApi;
