import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Icons personnalisés
const TrashIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(5.0);
  const [selectedPayment, setSelectedPayment] = useState('card');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      const mockCart = [
        {
          id: 1,
          name: "Tomates Bio",
          price: 3.5,
          quantity: 2,
          unit: "kg",
          image: null,
          seller: "Ferme des Verts",
          stock: 50
        },
        {
          id: 2,
          name: "Lait Frais",
          price: 1.2,
          quantity: 3,
          unit: "L",
          image: null,
          seller: "Laiterie du Coin",
          stock: 200
        },
        {
          id: 3,
          name: "Miel de Printemps",
          price: 6.0,
          quantity: 1,
          unit: "pot",
          image: null,
          seller: "Rucher du Sud",
          stock: 100
        }
      ];
      setCartItems(mockCart);
    }
    setLoading(false);
  };

  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost - promoDiscount;

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.find(i => i.id === itemId);
    if (newQuantity > item.stock) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
      saveCart([]);
    }
  };

  const applyPromo = () => {
    if (promoCode === 'AGRICULTURE10') {
      setPromoDiscount(subtotal * 0.1);
      alert('Code promo appliqué ! -10%');
    } else if (promoCode === 'BIENVENUE20') {
      setPromoDiscount(subtotal * 0.2);
      alert('Code promo appliqué ! -20%');
    } else if (promoCode) {
      alert('Code promo invalide');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    
    alert('Commande validée avec succès !');
    saveCart([]);
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="ml-[70px] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="ml-[70px] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Mon Panier</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {cartItems.length} article(s)
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBagIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Découvrez nos produits frais et remplissez votre panier !</p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">Produits</span>
                    <button
                      onClick={clearCart}
                      className="text-red-500 text-sm hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <TrashIcon />
                      Vider le panier
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <span className="text-4xl">🌱</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.seller}</p>
                              <p className="text-sm text-green-600 mt-1">
                                {item.price}AR / {item.unit}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <MinusIcon />
                              </button>
                              <span className="w-10 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <PlusIcon />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gray-800">
                                {(item.price * item.quantity).toFixed(2)}AR
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Résumé de la commande</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code promo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="CODE10"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}AR</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>{shippingCost.toFixed(2)}AR</span>
                  </div>
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <span>-{promoDiscount.toFixed(2)}AR</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-gray-800 text-lg">
                      <span>Total</span>
                      <span className="text-green-700">{total.toFixed(2)}AR</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode de paiement
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="card"
                        checked={selectedPayment === 'card'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="text-green-600"
                      />
                      <CreditCardIcon />
                      <span>Carte bancaire</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="transfer"
                        checked={selectedPayment === 'transfer'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="text-green-600"
                      />
                      <TruckIcon />
                      <span>Virement bancaire</span>
                    </label>
                  </div>
                </div>
                
                <div className="mb-6 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <TruckIcon />
                    <span className="font-medium">Livraison gratuite à partir de 50AR</span>
                  </div>
                  {subtotal < 50 && (
                    <div className="text-sm text-gray-600">
                      Plus que {(50 - subtotal).toFixed(2)}AR pour la livraison gratuite !
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                >
                  Commander ({total.toFixed(2)}AR)
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