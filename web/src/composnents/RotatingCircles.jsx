import React, { useEffect, useState } from 'react';

const RotatingCircles = () => {
  const [rotation, setRotation] = useState(0);
  
  const circles = [
    {
      id: 1,
      icon: "🌾",
      title: "Cultures Bio",
      count: "120+",
      size: 120,
      angle: 0,
      gradient: "from-agri-green-600 to-agri-green-800",
      delay: 0
    },
    {
      id: 2,
      icon: "🐄",
      title: "Élevage",
      count: "45+",
      size: 120,
      angle: 120,
      gradient: "from-agri-orange-500 to-agri-orange-600",
      delay: 0.5
    },
    {
      id: 3,
      icon: "🥬",
      title: "Produits Frais",
      count: "200+",
      size: 120,
      angle: 240,
      gradient: "from-agri-green-700 to-agri-green-900",
      delay: 1
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const radius = 160;

  const getCirclePosition = (angle) => {
    const radian = (angle + rotation) * (Math.PI / 180);
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center min-h-[500px]">
      <div className="relative w-[380px] h-[380px] md:w-[280px] md:h-[280px]">
        
        {/* Cercles en orbite */}
        {circles.map(circle => {
          const position = getCirclePosition(circle.angle);
          return (
            <div
              key={circle.id}
              className={`
                absolute rounded-full bg-gradient-to-br ${circle.gradient}
                backdrop-blur-sm flex flex-col items-center justify-center
                cursor-pointer transition-all duration-300 hover:scale-110
                animate-float border-2 border-white/30 shadow-xl
              `}
              style={{
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                left: `calc(50% + ${position.x}px - ${circle.size / 2}px)`,
                top: `calc(50% + ${position.y}px - ${circle.size / 2}px)`,
                animationDelay: `${circle.delay}s`
              }}
            >
              <div className="text-5xl mb-2 md:text-4xl">{circle.icon}</div>
              <div className="text-white font-bold text-center text-sm md:text-xs">
                {circle.title}
              </div>
              <div className="text-white/90 text-xs mt-1">{circle.count}</div>
            </div>
          );
        })}
        
        {/* Cercle central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[140px] h-[140px] rounded-full bg-gradient-to-br from-agri-green-800 to-agri-green-600
                        backdrop-blur-sm flex flex-col items-center justify-center text-white text-center
                        border-2 border-white/50 animate-pulse-slow cursor-pointer
                        hover:scale-105 transition-transform z-10">
          <div className="text-5xl">🌱</div>
          <div className="font-bold text-lg mt-2">AgriMarket</div>
          <div className="text-xs">Connect</div>
        </div>
      </div>
    </div>
  );
};

export default RotatingCircles;