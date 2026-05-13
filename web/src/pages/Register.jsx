import React, { useState } from 'react';
import api from '../service/api';
import image from '../assets/Image/bgHome.jpg';

const Register = () => {
  const [formData, setFormData] = useState({ 
    nomComplet: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.nomComplet.trim()) newErrors.nomComplet = 'Le nom est requis';
    else if (formData.nomComplet.length < 2) newErrors.nomComplet = 'Minimum 2 caractères';
    
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
      window.location.href = '/login';
    } catch (err) {
      setErrors({ api: "L'inscription a échoué. Cet email est peut-être déjà utilisé." });
    } finally {
      setIsLoading(false);
    }
  };

  // Style des inputs basé sur l'image (fond sombre, texte clair, coins arrondis)
  const inputStyle = (error) => `
    w-full px-5 py-3 rounded-full bg-[#144718] text-white border transition-all duration-300 outline-none placeholder:text-gray-500
    ${error ? 'border-red-500' : 'border-transparent focus:border-[#72b0ab]'}
  `;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1B5E20]  p-4 font-sans">
      {/* Container Principal (la "carte" sombre) */}
      <div className="relative w-full max-w-6xl h-[85vh] bg-[#1B5E20]  rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row ">
        
        {/* Section Gauche (Blanche avec forme courbe) */}
        <div className="hidden md:flex w-1/2 bg-white relative overflow-hidden items-center justify-center p-12">
            {/* Illustration (Simulée avec un SVG de sapin/nature pour le thème agricole) */}
            <div className="text-center z-10">
                <div className="text-[#2d4d43] mb-4">
                   <img src={image} alt="" className='object-cover' />
                </div>
            </div>

            {/* La forme courbe qui "mord" sur la section droite */}
            <div className="absolute -right-20 top-0 bottom-0 w-40 bg-white rounded-[100%]" style={{ height: '120%', top: '-10%' }}></div>
        </div>

        {/* Section Droite (Formulaire) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-10 relative">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-white text-4xl font-semibold mb-2">S'inscrire</h2>
            <p className="text-gray-400 mb-8 text-sm">Créez votre compte pour accéder au réseau</p>

            {errors.api && (
              <p className="text-red-400 text-xs mb-4 animate-pulse">{errors.api}</p>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nom Complet */}
              <div>
                <label className="block text-gray-300 text-sm mb-1 ml-4">Nom complet</label>
                <input
                  type="text"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                  className={inputStyle(errors.nomComplet)}
                  placeholder="Jean Dupont"
                />
                {errors.nomComplet && <p className="text-red-400 text-[10px] mt-1 ml-4">{errors.nomComplet}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm mb-1 ml-4">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputStyle(errors.email)}
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-4">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1 ml-4">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={inputStyle(errors.password)}
                    placeholder="••••••"
                  />
                  {errors.password && <p className="text-red-400 text-[10px] mt-1 ml-4">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1 ml-4">Confirmation</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={inputStyle(errors.confirmPassword)}
                    placeholder="••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1 ml-4">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Bouton style Login to Wifi */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-950 hover:bg-green-700 text-white font-bold py-3 rounded-full transition-all duration-300 mt-6 shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Chargement..." : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Déjà un compte ?{' '}
                <a href="/login" className="text-[#72b0ab] hover:underline font-semibold">
                  Se connecter
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;