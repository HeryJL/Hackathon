import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api'; // Utilisation de votre service API

// --- Icônes (Conservées telles quelles) ---
const TrashIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MinusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const ShoppingBagIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const CreditCardIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const TruckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('card');

  const IMAGE_BASE_URL = "http://localhost:4000";
  const SHIPPING_COST = 5000; // 5000 AR par exemple

  useEffect(() => {
    fetchCart();
  }, []);

  // 1. Récupérer le panier réel via l'API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart/cart');
      setCart(response.data);
    } catch (error) {
      console.error("Erreur panier", error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // 2. Mettre à jour la quantité (Backend + Local)
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    try {
      // Appelle PUT /cart/item de votre backend
      const response = await api.put('/cart/item', { itemId, quantity: newQuantity });
      setCart(response.data);
    } catch (error) {
      alert(error.response?.data?.error || "Erreur de stock");
    }
  };

  // 3. Supprimer un article
  const removeItem = async (itemId) => {
    try {
      // En envoyant 0, votre contrôleur fait un deleteMany
      const response = await api.put('/cart/item', { itemId, quantity: 0 });
      setCart(response.data);
    } catch (error) {
      console.error("Erreur suppression", error);
    }
  };

  // 4. Vider le panier
  const clearCart = async () => {
    if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
      try {
        await api.delete('/cart');
        setCart({ items: [] });
      } catch (error) {
        console.error("Erreur vidage", error);
      }
    }
  };

  // Calculs
  const subtotal = cart?.items?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;
  const total = subtotal + (subtotal > 50000 ? 0 : SHIPPING_COST) - promoDiscount;

  const applyPromo = () => {
    if (promoCode === 'FERMIER10') {
      setPromoDiscount(subtotal * 0.1);
      alert('Code promo appliqué ! -10%');
    } else {
      alert('Code invalide');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="ml-[70px] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Mon Panier</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
            {items.length} article(s)
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <ShoppingBagIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
            <button onClick={() => navigate('/products')} className="mt-4 px-8 py-3 bg-green-600 text-white rounded-xl font-bold">
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Liste des Produits */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <span className="font-semibold text-gray-600">Produits sélectionnés</span>
                  <button onClick={clearCart} className="text-red-500 text-sm flex items-center gap-1 hover:font-bold">
                    <TrashIcon /> Vider le panier
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {items.map(item => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-6">
                        <img 
                          src={item.product.images?.length > 0 ? `${IMAGE_BASE_URL}/${item.product.images[0]}` : ""} 
                          className="w-24 h-24 bg-gray-100 rounded-xl object-cover" 
                          alt={item.product.name}
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
                              <p className="text-sm text-gray-400 font-medium">📦 Vendu par une ferme locale</p>
                              <p className="text-green-600 font-bold mt-1">{item.product.price.toLocaleString()} AR / {item.product.unit}</p>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500">
                              <TrashIcon />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-lg"><MinusIcon /></button>
                              <span className="w-8 text-center font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-lg"><PlusIcon /></button>
                            </div>
                            <span className="font-black text-gray-800 text-lg">
                              {(item.product.price * item.quantity).toLocaleString()} AR
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Résumé de Commande */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Résumé</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} AR</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Livraison</span>
                    <span>{subtotal > 50000 ? "Gratuite" : `${SHIPPING_COST.toLocaleString()} AR`}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Réduction</span>
                      <span>-{promoDiscount.toLocaleString()} AR</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-4 flex justify-between text-2xl font-black text-gray-900">
                    <span>Total</span>
                    <span className="text-green-700">{total.toLocaleString()} AR</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Paiement</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setSelectedPayment('card')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedPayment === 'card' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}
                    >
                      <CreditCardIcon /> <span className="text-[10px] font-bold">CARTE</span>
                    </button>
                    <button 
                      onClick={() => setSelectedPayment('cash')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedPayment === 'cash' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}
                    >
                      <TruckIcon /> <span className="text-[10px] font-bold">ESPÈCES</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => alert("Commande envoyée au backend !")}
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
                >
                  VALIDER LA COMMANDE
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;