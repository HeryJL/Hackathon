import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../composnents/Sidebar';
import { FiSearch, FiFilter, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [activeSidebarItem, setActiveSidebarItem] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState('ACHETEUR'); // À remplacer par l'état réel

  // Données mockées pour l'exemple
  useEffect(() => {
    // Simulation d'appel API
    const mockProducts = [
      {
        id: 1,
        name: "Tomates Bio",
        description: "Tomates cerises bio cultivées en serre",
        price: 3.5,
        unit: "kg",
        quantity: 50,
        category: "LEGUMES",
        images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300"],
        seller: {
          name: "Ferme des Verts",
          location: "Loire",
          rating: 4.8
        },
        isOrganic: true,
        inStock: true
      },
      {
        id: 2,
        name: "Lait Frais",
        description: "Lait entier frais du jour",
        price: 1.2,
        unit: "L",
        quantity: 200,
        category: "PRODUITS_LAITIERS",
        images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300"],
        seller: {
          name: "Laiterie du Coin",
          location: "Bretagne",
          rating: 4.9
        },
        isOrganic: true,
        inStock: true
      },
      {
        id: 3,
        name: "Poulet Fermier",
        description: "Poulet élevé en plein air",
        price: 8.5,
        unit: "pièce",
        quantity: 30,
        category: "VIANDES",
        images: ["https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300"],
        seller: {
          name: "Élevage du Bonheur",
          location: "Normandie",
          rating: 4.7
        },
        isOrganic: false,
        inStock: true
      },
      {
        id: 4,
        name: "Miel de Printemps",
        description: "Miel toutes fleurs, récolte printemps",
        price: 6.0,
        unit: "pot",
        quantity: 100,
        category: "MIEL",
        images: ["https://images.unsplash.com/photo-1587049352847-5a222e6e6b6a?w=300"],
        seller: {
          name: "Rucher du Sud",
          location: "Provence",
          rating: 5.0
        },
        isOrganic: true,
        inStock: true
      },
      {
        id: 5,
        name: "Carottes Bio",
        description: "Carottes bio croquantes",
        price: 2.5,
        unit: "kg",
        quantity: 80,
        category: "LEGUMES",
        images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300"],
        seller: {
          name: "Ferme des Verts",
          location: "Loire",
          rating: 4.8
        },
        isOrganic: true,
        inStock: true
      },
      {
        id: 6,
        name: "Fromage de Chèvre",
        description: "Fromage frais de chèvre",
        price: 4.5,
        unit: "pièce",
        quantity: 45,
        category: "PRODUITS_LAITIERS",
        images: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?w=300"],
        seller: {
          name: "Chèvrerie des Alpes",
          location: "Savoie",
          rating: 4.6
        },
        isOrganic: true,
        inStock: true
      }
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Catégories uniques
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} ajouté au panier !`);
  };

  const categoryLabels = {
    LEGUMES: 'Légumes',
    FRUITS: 'Fruits',
    VIANDES: 'Viandes',
    PRODUITS_LAITIERS: 'Produits laitiers',
    OEUFS: 'Œufs',
    MIEL: 'Miel',
    CEREALES: 'Céréales',
    PLANTES: 'Plantes',
    AUTRE: 'Autre'
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
      
      {/* Contenu principal */}
      <div className="ml-[70px] p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nos Produits</h1>
              <p className="text-gray-600 mt-1">Découvrez les produits frais de nos producteurs locaux</p>
            </div>
            
            {/* Bouton Devenir Vendeur */}
            {userRole !== 'PRODUCTEUR' && (
              <button
                onClick={() => setShowSellerModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="text-xl">🌱</span>
                Devenir Vendeur
              </button>
            )}
          </div>
          
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit ou un producteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tous' : categoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Grille des produits */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.isOrganic && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Bio
                    </span>
                  )}
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-red-50 transition-colors">
                    <FiHeart className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                
                {/* Infos produit */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">{categoryLabels[product.category]}</span>
                    <span className="text-xs text-green-600 font-semibold">✓ Stock: {product.quantity} {product.unit}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  
                  {/* Vendeur */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">
                      👨‍🌾
                    </div>
                    <span className="text-sm text-gray-600">{product.seller.name}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <FiStar className="text-yellow-400 fill-yellow-400 text-xs" />
                      <span className="text-sm font-semibold">{product.seller.rating}</span>
                    </div>
                  </div>
                  
                  {/* Prix et bouton */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-green-700">{product.price}€</span>
                      <span className="text-gray-500 text-sm"> /{product.unit}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FiShoppingCart className="text-sm" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Aucun résultat */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
          </div>
        )}
      </div>
      
      {/* Modal Devenir Vendeur */}
      {showSellerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Devenir Vendeur</h2>
            <p className="text-gray-600 mb-6">
              Rejoignez notre communauté de producteurs et vendez vos produits directement aux acheteurs locaux.
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ferme des..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option>Agriculteur</option>
                  <option>Éleveur</option>
                  <option>Producteur laitier</option>
                  <option>Maraîcher</option>
                  <option>Viticuleur</option>
                  <option>Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Présentez votre exploitation..."
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSellerModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;