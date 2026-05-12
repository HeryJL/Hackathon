import React, { useState } from 'react';
import api from '../service/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', credentials);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      alert("Identifiants incorrects " + err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80')"}}>
      {/* Overlay avec Vert Foncé à 85% d'opacité */}
      <div className="absolute inset-0 bg-[#1B5E20] opacity-85"></div>

      <div className="relative z-10 max-w-sm w-full bg-white/95 p-8 rounded-xl shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-farm-green rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-farm-green outline-none bg-transparent"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Mot de passe</label>
            <input 
              type="password" required
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-farm-green outline-none bg-transparent"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button className="w-full bg-farm-green text-white py-2 rounded shadow-lg hover:bg-farm-hover font-semibold tracking-wide">
            SE CONNECTER
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Nouveau ? <a href="/register" className="text-farm-medium font-bold hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;