import React, { useState } from 'react';
import api from '../service/api'; // Votre instance Axios avec JWT

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) return alert("Mots de passe différents");
    
    try {
      await api.post('/auth/register', formData);
      alert("Compte créé avec succès ! Connectez-vous.");
    } catch (err) {
      console.error("Erreur d'inscription", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border-t-4 border-farm-medium">
        <h2 className="text-3xl font-bold text-center text-farm-dark mb-6">Rejoindre la Ferme</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full p-3 border rounded focus:outline-none focus:border-farm-green"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Mot de passe" 
            className="w-full p-3 border rounded focus:outline-none focus:border-farm-green"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <input 
            type="password" placeholder="Confirmer le mot de passe" 
            className="w-full p-3 border rounded focus:outline-none focus:border-farm-green"
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
          <button type="submit" className="w-full bg-farm-green text-white py-3 rounded-md font-bold hover:bg-farm-hover transition shadow-md">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;