import React from 'react';
import { useNavigate } from 'react-router-dom';

// Icônes SVG
const HomeIcon = () => (
  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
    <path d="M12 3L2 9L4 10.5L12 5L20 10.5L22 9L12 3ZM12 7L4 12V20H8V14H16V20H20V12L12 7Z"/>
  </svg>
);

const ProductsIcon = () => (
  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
    <path d="M5 4H19V6H5V4ZM5 8H19V10H5V8ZM5 12H19V14H5V12ZM3 18H21V20H3V18ZM7 16H9V18H7V16ZM15 16H17V18H15V16Z"/>
  </svg>
);

const AnimalsIcon = () => (
  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
    <path d="M12 4C10 4 8.5 5.5 8.5 7.5C8.5 8.5 9 9.5 10 10L8 14H5L3 18H5L7 14H10L12 18H14L16 14H19L21 18H23L21 14H18L16 10C17 9.5 17.5 8.5 17.5 7.5C17.5 5.5 16 4 14 4C13 4 12 4.5 11.5 5.5C11 4.5 10 4 12 4Z"/>
  </svg>
);

const MachineryIcon = () => (
  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
    <path d="M5 6L7 8L9 6L11 8L13 6L15 8L17 6L19 8L20 6L19 4H6L5 6ZM4 10H20V18H17V20H14V18H10V20H7V18H4V10Z"/>
  </svg>
);

const FarmerIcon = () => (
  <svg className="w-5 h-5 fill-agri-green-800" viewBox="0 0 24 24">
    <path d="M12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 14C8.67 14 3 15.67 3 19V20H21V19C21 15.67 15.33 14 12 14Z"/>
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"/>
  </svg>
);

const LogoIcon = () => (
  <svg className="w-6 h-6 fill-agri-green-800" viewBox="0 0 24 24">
    <path d="M12 2L15 8.5L21 9L17 13L18.5 19L12 16L5.5 19L7 13L3 9L9 8.5L12 2Z"/>
  </svg>
);

const Sidebar = ({ activeItem, onItemClick }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: HomeIcon, path: '/' },
    { id: 'products', label: 'Produits', icon: ProductsIcon, path: '/products' },
    { id: 'animals', label: 'Élevage', icon: AnimalsIcon, path: '/animals' },
    { id: 'machines', label: 'Matériel', icon: MachineryIcon, path: '/machines' },
  ];

  const handleItemClick = (item) => {
    // Appeler le callback pour mettre à jour l'item actif
    if (onItemClick) {
      onItemClick(item.id);
    }
    // Naviguer vers la page correspondante
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed left-0   rounded-se-[10px] top-0 h-full w-[70px] bg-green-800 shadow-2xl backdrop-blur-md flex flex-col items-center  z-50 border-r border-white/20 group hover:w-[90px] transition-all duration-300">
      
      {/* Logo - Redirige vers l'accueil */}
      <div 
        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center my-8 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => handleItemClick({ id: 'home', path: '/' })}
      >
        <LogoIcon />
      </div>
      
      {/* Navigation Items - Centrés verticalement */}
      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`
                relative flex items-center justify-center gap-3 p-2.5 rounded-xl cursor-pointer
                transition-all duration-300 hover:bg-white/20 w-full
                ${activeItem === item.id ? 'bg-white/25 shadow-lg' : ''}
              `}
            >
              <div className="hover:scale-110 transition-transform">
                <IconComponent />
              </div>
              <span className={`
                text-white text-sm font-medium whitespace-nowrap 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                absolute top-[40px]
              `}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* User Section - En bas */}
      <div className="flex flex-col items-center gap-4 pt-6 mt-auto border-t border-white/20 w-full">
        <div 
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate('/profile')}
        >
          <FarmerIcon />
        </div>
        <div 
          className="w-9 h-9 rounded-full bg-transparent border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate('/cart')}
        >
          <CartIcon />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;