import React, { useState } from 'react';
import api from '../service/api';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide';
    if (formData.password.length < 6) newErrors.password = '6 caractères minimum';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert('Compte créé avec succès ! Connectez-vous.');
      window.location.href = '/login';
    } catch (err) {
      setErrors({ api: "Erreur d'inscription. Email peut-être déjà utilisé." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80')" }}>
      {/* Overlay vert foncé 85% */}
      <div className="absolute inset-0 bg-[#1B5E20] opacity-85"></div>

      <div className="relative z-10 max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-[#4CAF50] rounded-full text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Rejoindre la Ferme</h2>

        {errors.api && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errors.api}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-[#4CAF50] outline-none bg-transparent transition-colors`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border-b-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-[#4CAF50] outline-none bg-transparent transition-colors`}
                placeholder="••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer le mot de passe</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border-b-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-[#4CAF50] outline-none bg-transparent transition-colors`}
                placeholder="••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Création en cours...' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <a href="/login" className="text-[#2E7D32] font-bold hover:underline transition">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;