import axios from 'axios';


// L'URL change selon l'environnement (Mobile ou Web)
const API_URL = 'http://localhost:5000/api' 
  
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(async (config) => {
  // Pour le web : localStorage / Pour Expo : Utilisez SecureStore ou AsyncStorage
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;