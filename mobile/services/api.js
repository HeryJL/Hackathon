import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// REMPLACEZ PAR VOTRE IP LOCALE (Tapez 'ipconfig' ou 'ifconfig' dans votre terminal)
const BASE_URL = 'http://10.72.44.115:4000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Intercepteur pour injecter le JWT
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;