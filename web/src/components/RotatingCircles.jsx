import React from 'react';
import { motion } from 'framer-motion';

import cultureImage from '../assets/Image/Les Vegetaux.png';
import elevageImage from '../assets/Image/les_Animeaux.png';
import produitImage from '../assets/Image/Mais.png';
import logoImage from '../assets/Image/poule.png';

const RotatingCircles = () => {
  const circles = [
    { id: 1, image: cultureImage, title: "Cultures Bio", count: "120+", color: "#4CAF50", angle: 0 },
    { id: 2, image: elevageImage, title: "Élevage", count: "45+", color: "#2E7D32", angle: 120 },
    { id: 3, image: produitImage, title: "Produits Frais", count: "200+", color: "#388E3C", angle: 240 },
  ];

  const radius = 220; // Rayon de l'orbite

  return (
    <div className="relative w-full h-full flex justify-center items-center min-h-[600px]">
      <div className="relative w-[600px] h-[600px] flex justify-center items-center">
        
        {/* Conteneur de rotation globale */}
        <motion.div
          className="relative w-full h-full flex justify-center items-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {circles.map((circle) => (
            <motion.div
              key={circle.id}
              className="absolute rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer"
              style={{
                width: 160,
                height: 160,
                backgroundColor: circle.color,
                // Positionnement initial sur le cercle
                left: `calc(50% + ${Math.cos(circle.angle * (Math.PI / 180)) * radius}px - 80px)`,
                top: `calc(50% + ${Math.sin(circle.angle * (Math.PI / 180)) * radius}px - 80px)`,
              }}
              // Animation de contre-rotation pour que le texte reste droit
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.2, zIndex: 50 }}
            >
              <img src={circle.image} alt={circle.title} className="w-16 h-16 object-contain mb-2" />
              <div className="text-white font-bold text-sm">{circle.title}</div>
              <div className="text-white/80 text-xs">{circle.count}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cercle Central Statique */}
        <motion.div 
          className="absolute z-20 w-[220px] h-[220px] rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
          style={{ backgroundColor: '#1B5E20' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.img 
            src={logoImage} 
            alt="Logo" 
            className="w-24 h-24 object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="font-bold text-xl uppercase tracking-tighter">AgriMarket</div>
        </motion.div>

      </div>
    </div>
  );
};

export default RotatingCircles;