import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../composnents/Sidebar';
import RotatingCircles from '../composnents/RotatingCircles';
import bgVideo from '../assets/bg-video.mp4';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSidebarItem, setActiveSidebarItem] = useState('home');
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Vidéo en fond */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      
      {/* Overlay dégradé pour meilleure lisibilité */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-agri-green-950 via-agri-green-900 to-agri-green-800 z-10" />
      
      {/* Sidebar */}
      <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
      
      {/* Contenu */}
      <div className="relative z-20 flex min-h-screen ml-[70px]">
        
        {/* Texte à gauche */}
        <div className="w-1/2 flex flex-col justify-center p-10 text-white">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Agriculture <span className="text-green-400">Durable</span><br />
            & Élevage <span className="text-green-400">Responsable</span>
          </h1>
          
          <p className="text-lg mb-6 leading-relaxed drop-shadow-md">
            La première plateforme qui connecte directement les producteurs locaux
            avec les acheteurs passionnés. Des produits frais, de qualité, 
            issus d'une agriculture respectueuse de l'environnement.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-green-800 text-white font-bold rounded-full hover:bg-agri-green-700 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-green-800 font-bold rounded-full hover:bg-gray-100 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              Inscription
            </button>
          </div>
        </div>
        
        {/* Cercles à droite */}
        <div className="w-1/2 flex justify-center items-center">
          <RotatingCircles />
        </div>
      </div>
    </div>
  );
};

export default HomePage;