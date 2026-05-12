import React, { useState } from 'react';
import api from '../service/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!credentials.email || !credentials.password) {
      setError('Tous les champs sont requis');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', credentials);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80')" }}>
      <div className="absolute inset-0 bg-[#1B5E20] opacity-85"></div>

      <div className="relative z-10 max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-[#4CAF50] rounded-full text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Connexion</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-[#4CAF50] outline-none bg-transparent transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 focus:border-[#4CAF50] outline-none bg-transparent transition-colors"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'SE CONNECTER'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Nouveau sur la plateforme ?{' '}
          <a href="/register" className="text-[#2E7D32] font-bold hover:underline transition">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;