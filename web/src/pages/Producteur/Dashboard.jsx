import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Leaf, Package, User, Plus, MapPin, 
  ChevronRight, CheckCircle, AlertTriangle,
  Loader2, LayoutDashboard, Sprout
} from 'lucide-react';
import api from '../../service/api';
import { COLORS as C } from '../../constants/theme';
import { StatCard, Btn } from '../../components/UI';
import ProductModal from '../../components/Product/ProductModal';
import FarmDetail from '../../components/Farm/FarmDetail';
import AddFarmModal from '../../components/Farm/AddFarmModal';
import AddProductModal from '../../components/Product/AddProductModal';

// --- Variantes d'animation ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const Badge = ({ children, type = 'default' }) => {
  const styles = {
    default: { bg: C.lightBg2, color: C.dark, border: C.border },
    warning: { bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
    success: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
    danger: { bg: '#FFEBEE', color: '#B71C1C', border: '#FFCDD2' },
    info: { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  };
  const s = styles[type] || styles.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 12px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase'
    }}>{children}</span>
  );
};

const Toast = ({ message, type }) => (
  <motion.div 
    initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
    style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 2000,
      background: type === 'success' ? '#1a1a1a' : '#c62828',
      color: '#fff', borderRadius: 12, padding: '14px 20px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)', fontSize: 14, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 12,
    }}
  >
    {type === 'success' ? <CheckCircle size={18} color="#4CAF50" /> : <AlertTriangle size={18} color="#FFEBEE" />}
    {message}
  </motion.div>
);

const EspaceProducteur = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('fermes');
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [farmsRes, productsRes] = await Promise.all([
        api.get('/farms'),
        api.get('/products'),
      ]);
      setFarms(farmsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      showToast("Erreur lors de la récupération des données", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFarmCreated = (newFarm) => {
    setFarms(prev => [newFarm, ...prev]);
    showToast(`Ferme "${newFarm.nom}" créée avec succès !`);
  };

  const handleProductCreated = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Produit créé avec succès !`);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.lightBg }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Loader2 size={40} className="animate-spin" style={{ color: C.primary, margin: '0 auto 16px' }} />
        <p style={{ color: C.dark, fontWeight: 600 }}>Synchronisation...</p>
      </motion.div>
    </div>
  );

  if (selectedFarm) return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ minHeight: '100vh', background: C.lightBg, padding: '28px 16px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <FarmDetail farm={selectedFarm} products={products} onBack={() => setSelectedFarm(null)} />
      </div>
    </motion.div>
  );

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  return (
    <div className="animated-bg" style={{ minHeight: '100vh', paddingBottom: 50 }}>
      <header style={{ padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 70 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
             <LayoutDashboard color={C.primary} size={22} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ 
              color: '#fff', background: '#1B5E20', borderRadius: '10px', 
              padding: '8px 20px', fontWeight: 700, fontSize: 18, 
              textTransform: 'uppercase', letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(27, 94, 32, 0.3)'
            }}>
              Espace Producteur
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')} 
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fff', border: `1px solid ${C.border}`,
                color: C.dark, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}
            >
              <User size={16} /> Mon profil
            </motion.button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
        
        {/* Stats Section avec SHADOWS améliorées */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: 25, 
            marginBottom: 40, 
            padding: '30px', 
            borderRadius: 24, 
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
          }}
        >
          {[
            { icon: <Home size={22} color={C.primary}/>, label: "Fermes", value: farms.length, sub: "Unités de production" },
            { icon: <Leaf size={22} color={C.primary}/>, label: "Produits", value: products.length, sub: "Catalogue actif" },
            { icon: <Package size={22} color={C.primary}/>, label: "Stock total", value: totalStock, sub: "Unités en entrepôt" }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              style={{
                background: '#fff',
                padding: '5px',
                borderRadius: 20,
                // AJOUT DES SHADOWS ICI
                boxShadow: '0 10px 25px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.03)'
              }}
            >
              <StatCard icon={stat.icon} label={stat.label} value={stat.value} sub={stat.sub} />
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, background: 'rgba(0,0,0,0.05)', borderRadius: 14, padding: 5, width: 'fit-content' }}>
          {[
            { id: 'fermes', label: 'Mes fermes', icon: <Home size={16} /> },
            { id: 'produits', label: 'Mes produits', icon: <Leaf size={16} /> }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, zIndex: 1, color: activeTab === t.id ? C.darker : '#666',
            }}>
              {activeTab === t.id && (
                <motion.div 
                  layoutId="activeTab"
                  style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 10, zIndex: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              )}
              {React.cloneElement(t.icon, { color: activeTab === t.id ? C.primary : '#666' })}
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'fermes' ? (
            <motion.div key="fermes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Gestion des Fermes</h2>
                <Btn onClick={() => setShowAddFarm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)' }}>
                  <Plus size={18} /> Ajouter une ferme
                </Btn>
              </div>

              {farms.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 24, border: `1px dashed #ccc`, padding: '60px 24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <Sprout size={48} color="#ccc" style={{ marginBottom: 16 }} />
                  <p>Aucune ferme configurée</p>
                  <Btn onClick={() => setShowAddFarm(true)}>Créer ma première ferme</Btn>
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 25 }}>
                  {farms.map(farm => (
                    <motion.div 
                      key={farm.id} variants={itemVariants} whileHover={{ y: -10, boxShadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                      onClick={() => setSelectedFarm(farm)}
                      style={{ 
                        background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)', transition: 'box-shadow 0.3s ease'
                      }}
                    >
                      <div style={{ height: 160, background: '#f0f0f0', position: 'relative' }}>
                        {farm.images?.[0] ? (
                          <img src={`http://localhost:3000/${farm.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Home size={40} color={C.primary} strokeWidth={1} />
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                          {farm.certifie && <Badge type="success">Bio</Badge>}
                        </div>
                      </div>
                      <div style={{ padding: 20 }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>{farm.nom}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#777', fontSize: 13, marginBottom: 16 }}>
                          <MapPin size={14} /> {farm.localisation}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                          <span style={{ fontSize: 12, color: '#999' }}>{products.filter(p => p.farmId === farm.id).length} Produits</span>
                          <div style={{ color: C.primary, display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700 }}>Gérer <ChevronRight size={16} /></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="produits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Inventaire Produits</h2>
                <Btn onClick={() => farms.length === 0 ? showToast("Créez d'abord une ferme.", 'error') : setShowAddProduct(true)}>
                  <Plus size={18} /> Ajouter un produit
                </Btn>
              </div>

              <motion.div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 100px', padding: '20px 24px', background: '#fcfcfc', borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 800, color: '#999' }}>
                  <span>DÉSIGNATION</span><span>PROVENANCE</span><span>PRIX</span><span>STOCK</span><span>ACTION</span>
                </div>
                {products.map((product, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    key={product.id} 
                    style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 100px', padding: '16px 24px', alignItems: 'center', borderBottom: i < products.length - 1 ? `1px solid ${C.border}` : 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 45, height: 45, borderRadius: 12, background: '#f0f4f2', overflow: 'hidden' }}>
                        {product.images?.[0] ? <img src={`http://localhost:3000/${product.images[0]}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/> : <Leaf size={18} color={C.primary} />}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{product.name || product.nom}</span>
                    </div>
                    <span style={{ fontSize: 13 }}>{product.farm?.nom || '—'}</span>
                    <span style={{ fontWeight: 800 }}>{product.price || product.prix} Ar</span>
                    <Badge type={(product.stock || 0) > 10 ? 'success' : 'warning'}>{product.stock || 0} pcs</Badge>
                    <button onClick={() => setSelectedProduct(product)} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 700, cursor: 'pointer' }}>Détails</button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>

      {showAddFarm && <AddFarmModal onClose={() => setShowAddFarm(false)} onSuccess={handleFarmCreated} />}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onSuccess={handleProductCreated} farms={farms} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      
      {/* --- CSS POUR L'ANIMATION DE FOND ET SPIN --- */}
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .animated-bg {
          background: linear-gradient(-45deg, #f8faf9, #edf5f0, #fdfdfd, #f1f8f4);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default EspaceProducteur;