import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const [activeSidebarItem, setActiveSidebarItem] = useState('home');

  // Mettre à jour l'item actif en fonction de l'URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveSidebarItem('home');
    else if (path === '/products') setActiveSidebarItem('products');
    //else if (path === '/animals') setActiveSidebarItem('animals');
    //else if (path === '/machines') setActiveSidebarItem('machines');
    else if (path === '/cart') setActiveSidebarItem('cart');
    //else if (path === '/profile') setActiveSidebarItem('profile');
  }, [location]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixe */}
      <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
      
      {/* Contenu principal avec marge pour la sidebar */}
      <main className="flex-1 ">
        {children}
      </main>
    </div>
  );
};

export default Layout;