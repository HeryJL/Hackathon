import React, { useState } from 'react';
import api from '../service/api';
import image from '../assets/Image/bgHome.jpg';

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

  // Style des inputs basé sur l'image (Sombre, arrondi, bordure discrète)
  const inputStyle = `
    w-full px-5 py-3 rounded-full bg-[#144718] text-white border border-transparent 
    focus:border-[#4CAF50] outline-none transition-all duration-300 placeholder:text-gray-500
  `;

  return (
    <div className="min-h-screen shadow-xl w-full flex items-center justify-center bg-[#1B5E20] p-4 font-sans">
      {/* Container Principal Style "Carte" */}
      <div className="relative w-full max-w-6xl h-[80vh] bg-[#1B5E20] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row ">
        
        {/* SECTION GAUCHE : Blanche avec l'illustration et la courbe */}
        <div className="hidden md:flex w-1/2 bg-white relative overflow-hidden items-center justify-center p-12">
          {/* Illustration centrale (similaire à l'arbre de l'image) */}
          <div className="text-center z-10">
            <img src={image} alt="" className='object-cover' />
          </div>

          {/* LA COURBE : L'élément clé du design de l'image */}
          <div className="absolute -right-24 top-0 bottom-0 w-48 bg-white rounded-[100%] scale-y-125"></div>
        </div>

        {/* SECTION DROITE : Formulaire sur fond vert #1B5E20 */}
        <div className="w-full md:w-1/2 flex flex-col justify-center top-6 px-8 md:px-24 py-10 relative">
          <div className="max-w-sm w-full mx-auto">
            
            <h2 className="text-white text-5xl font-bold mb-2 tracking-tight">Se connecter</h2>
            <p className="text-green-200/60 mb-10 text-sm">Veuillez entrer vos identifiants</p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-xs rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium ml-4">Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className={inputStyle}
                  placeholder="email@gmail.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="block text-gray-300 text-sm font-medium">Mot de passe</label>
                </div>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className={inputStyle}
                  placeholder="••••••"
                />
              </div>

              {/* Bouton style "Login to Wifi" */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4CAF50] hover:bg-[#5bbd5f] text-white font-bold py-3.5 rounded-full transition-all duration-300 mt-4 shadow-xl shadow-black/20 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </span>
                ) : 'Se connecter'}
              </button>
            </form>

            {/* Inscription */}
            <div className="mt-10 text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Deja un compte? 
                <a href="/register" className="text-[#4CAF50] hover:text-white font-bold transition-colors underline underline-offset-4 decoration-1">
                  S'inscrire
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;