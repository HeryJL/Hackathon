import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icônes ---
const ShoppingCartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// --- Carousel (On garde Motion ici pour le glissement fluide) ---
const ImageCarousel = () => {
  const slides = [
    { url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074", title: "Animaux", desc: "Élevage plein air" },
    { url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070", title: "Végétaux", desc: "Récolte du jour" },
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070", title: "Ferme", desc: "Produits locaux" }
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[2rem] mb-10 shadow-2xl group border border-gray-200 bg-white">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={slides[index].url} alt="Slide" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-12 text-white">
            <h2 className="text-4xl font-black">{slides[index].title}</h2>
            <p className="text-xl opacity-90">{slides[index].desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-xl p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50">
        ←
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-xl p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50">
        →
      </button>
    </div>
  );
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const products = [
    { id: 1, name: "Veau de Lait", cat: "ANIMAUX", price: 15500, img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=500" },
    { id: 2, name: "Panier de Saison", cat: "VEGETAL", price: 12000, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500" },
    { id: 3, name: "Poulet Fermier", cat: "ANIMAUX", price: 9500, img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=500" },
    { id: 4, name: "Tomates Anciennes", cat: "VEGETAL", price: 4200, img: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=500" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6 font-sans text-gray-900">
      
      {/* NAVBAR */}
      <nav className="flex justify-end items-center mb-8 px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold px-6 py-3 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-md"
          >
            DEVENIR PRODUCTEUR
          </button>
          <button className="relative p-3 bg-white shadow-md rounded-full border border-gray-100 transition-transform active:scale-90">
            <ShoppingCartIcon />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto">
        <ImageCarousel />

        {/* BARRE DE RECHERCHE */}
        <div className="relative mb-12 max-w-xl mx-auto">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 shadow-xl rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
          />
        </div>

        {/* GRILLE PRODUITS (SANS GSAP / SANS MOTION) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
                    {product.cat}
                  </span>
                </div>
              </div>

              {/* Contenu de la Carte */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-400 mb-6 font-medium">Production locale</p>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prix</span>
                    <span className="text-2xl font-black text-green-700">{product.price.toLocaleString()} AR</span>
                  </div>
                  
                  <button
                    onClick={() => setCartCount(prev => prev + 1)}
                    className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-green-600 active:scale-90 transition-all shadow-lg"
                  >
                    <ShoppingCartIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;