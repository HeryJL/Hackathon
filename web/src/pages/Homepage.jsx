import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Sidebar from '../composnents/Sidebar';
import RotatingCircles from '../composnents/RotatingCircles';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSidebarItem, setActiveSidebarItem] = useState('home');
  const textRef = useRef(null);

  // Animation GSAP pour un effet subtil de flottement sur le texte
  useEffect(() => {
    gsap.to(textRef.current, {
      y: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  // Variantes Framer Motion pour l'entrée
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1B5E20] overflow-hidden font-sans">
      {/* Overlay couleur (85% opacité) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#1B5E20] opacity-85 z-10" />
      
      {/* Sidebar - Couleur spécifique 95% */}
      <div className="relative z-30 bg-[#2E7D32] bg-opacity-95">
        <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
      </div>
      
      <div className="relative z-20 flex min-h-screen ml-16">
        
        {/* Section Texte avec Framer Motion */}
        <motion.div 
          className="w-1/2 flex flex-col justify-center p-12 text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          ref={textRef}
        >
          <motion.h1 
            variants={itemVariants}
            className="text-7xl font-extrabold mb-6 leading-tight"
          >
            Agriculture <span className="text-[#4CAF50]">Durable</span><br />
            & Élevage <span className="text-[#4CAF50]">Responsable</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl mb-8 leading-relaxed max-w-lg text-gray-100"
          >
            La première plateforme qui connecte directement les producteurs locaux
            avec les acheteurs passionnés.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-5">
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
          </motion.div>
        </motion.div>
        
        {/* Section Visuelle (Cercles) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="w-1/2 flex justify-center items-center"
        >
          <div className="relative">
             {/* Un petit effet de halo derrière les cercles */}
            <div className="absolute inset-0 bg-[#388E3C] blur-[100px] opacity-20 rounded-full" />
            <RotatingCircles />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;