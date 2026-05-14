import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../service/api'; // Import de votre instance axios personnalisée

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

// --- Carousel ---
const ImageCarousel = () => {
  const slides = [
    { url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074", title: "Produits Frais", desc: "Directement de nos fermes" },
    { url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070", title: "Bio & Naturel", desc: "Sans pesticides" },
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070", title: "Local", desc: "Soutenez vos producteurs" }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-[2.5rem] mb-12 shadow-2xl group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={slides[index].url} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
            <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} className="text-5xl font-black mb-2">{slides[index].title}</motion.h2>
            <motion.p initial={{ y: 20 }} animate={{ y: 0 }} className="text-xl opacity-90">{slides[index].desc}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Page des Produits ---
const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const IMAGE_BASE_URL = "http://localhost:4000";

  // 1. Charger les produits (avec recherche si nécessaire)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Utilise l'instance 'api' qui pointe déjà vers /api
      const response = await api.get('/products', {
        params: search ? { search } : {}
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur chargement produits", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Charger le compte du panier au démarrage
  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart/cart');
      const count = response.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (error) {
      // Silencieux si non connecté
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [search]);

  // 3. Ajouter au panier via le Backend
  const handleAddToCart = async (productId) => {
    try {
      // L'intercepteur dans api.js ajoute automatiquement le token Bearer
      await api.post('/cart', { productId, quantity: 1 });
      setCartCount(prev => prev + 1);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Connectez-vous pour commander des produits !");
        navigate('/login');
      } else {
        alert(error.response?.data?.error || "Stock épuisé ou erreur serveur");
      }
    }
  };

  return (
    <div className="ml-20 min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* HEADER & NAVIGATION */}
      <header className=" mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">MARCHÉ FRAIS</h1>
          <p className="text-sm text-gray-400 font-bold">Produits locaux en direct des fermes</p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/seller-request')}
            className="hidden md:block text-xs font-black px-6 py-3 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all shadow-sm"
          >
            DEVENIR PRODUCTEUR
          </button>
          
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-4 bg-white shadow-xl rounded-2xl border border-gray-100 hover:scale-110 transition-transform active:scale-95"
          >
            <ShoppingCartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black border-2 border-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className=" mx-auto">
        <ImageCarousel />

        {/* BARRE DE RECHERCHE */}
        <div className="relative mb-16 max-w-2xl mx-auto group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </div>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pommes de terre, Miel, Ferme du Sud..." 
            className="w-full pl-14 pr-8 py-5 bg-white border border-gray-200 shadow-2xl rounded-[2rem] focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-lg font-medium"
          />
        </div>

        {/* GRILLE DE PRODUITS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Chargement des récoltes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product.id}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-50 hover:shadow-2xl transition-all duration-500"
              >
                {/* Image du Produit */}
                <div className="h-64 relative overflow-hidden bg-gray-100">
                  <img 
                    src={product.images?.length > 0 
                      ? `${IMAGE_BASE_URL}/${product.images[0]}` 
                      : "https://via.placeholder.com/400x400?text=Produit"} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-800 shadow-sm">
                      {product.category || "Ferme"}
                    </span>
                  </div>
                  {product.isOrganic && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">BIO</span>
                    </div>
                  )}
                </div>

                {/* Détails */}
                <div className="p-7">
                  <h4 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">{product.name}</h4>
                  <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="text-lg">🚜</span> {product.farm?.nom || "Provenance directe"}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prix</span>
                      <span className="text-2xl font-black text-gray-900">
                        {product.price.toLocaleString()} <span className="text-sm font-medium text-gray-500">AR</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">par {product.unit || "unité"}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock <= 0}
                      className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${
                        product.stock > 0 
                        ? "bg-gray-900 text-white hover:bg-green-600 hover:shadow-green-200" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? <ShoppingCartIcon /> : <span className="text-[10px] font-black">RUPTURE</span>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {!loading && products.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-inner border border-dashed border-gray-200">
            <span className="text-6xl mb-4 block">🍃</span>
            <h3 className="text-2xl font-bold text-gray-800">Aucun produit trouvé</h3>
            <p className="text-gray-400 mt-2">Essayez d'élargir votre recherche ou de changer de catégorie.</p>
            <button onClick={() => setSearch("")} className="mt-6 text-green-700 font-black underline">Voir tout le catalogue</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;