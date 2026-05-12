import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://192.168.1.XXX:5000/api', // Votre IP locale PC
});

api.interceptors.request.use(async (config) => {
  // Récupération sécurisée du token sur mobile
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;