import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api';
import { COLORS as C } from '../../constants/theme';
import { StatCard, Btn } from '../../components/UI';
import ProductModal from '../../components/Product/ProductModal';
import FarmDetail from '../../components/Farm/FarmDetail';
import AddFarmModal from '../../components/Farm/AddFarmModal';
import AddProductModal from '../../components/Product/AddProductModal';

const Badge = ({ children, type = 'default' }) => {
  const styles = {
    default: { bg: C.lightBg2, color: C.dark, border: C.border },
    warning: { bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
    success: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
    danger: { bg: '#FFEBEE', color: '#B71C1C', border: '#FFCDD2' },
    info: { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  };
  const s = styles[type];
  return (
    <span style={{
      display: 'inline-block', padding: '3px 11px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 12, fontWeight: 600,
    }}>{children}</span>
  );
};

const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 2000,
      background: type === 'success' ? C.dark : '#c62828',
      color: '#fff', borderRadius: 12, padding: '14px 20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.18)', fontSize: 14, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideIn 0.3s ease',
    }}>
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <span>{type === 'success' ? '✅' : '⚠'}</span>
      {message}
    </div>
  );
};

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

  const showToast = (message, type = 'success') => setToast({ message, type });

  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [farmsRes, productsRes] = await Promise.all([
        api.get('/farms'),
        api.get('/products'),
      ]);
      setFarms(farmsRes.data);
      setProducts(productsRes.data);
      console.log(farmsRes.data)
      console.log(productsRes.data)
    } catch (err) {
      console.error(err);
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
    showToast(`Produit "${newProduct.name || newProduct.nom}" créé avec succès !`);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.lightBg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `4px solid ${C.border}`, borderTopColor: C.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: C.dark, fontWeight: 500 }}>Chargement...</p>
      </div>
    </div>
  );

  if (selectedFarm) return (
    <div style={{ minHeight: '100vh', background: C.lightBg, padding: '28px 16px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <FarmDetail farm={selectedFarm} products={products} onBack={() => setSelectedFarm(null)} />
      </div>
    </div>
  );

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: C.lightBg }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.darker})`, padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 0.3 }}>Espace producteur</span>
          </div>
          <button onClick={() => navigate('/profil')} style={{
            background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>Mon profil</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
          <StatCard icon="🏡" label="Fermes" value={farms.length} sub="enregistrées" />
          <StatCard icon="🥬" label="Produits" value={products.length} sub="référencés" />
          <StatCard icon="📦" label="Stock total" value={totalStock} sub="unités disponibles" />
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: 'fit-content' }}>
          {[{ id: 'fermes', label: '🏡 Mes fermes' }, { id: 'produits', label: '🥬 Mes produits' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? C.primary : 'transparent',
              color: activeTab === t.id ? '#fff' : '#555',
              border: 'none', borderRadius: 7, padding: '8px 20px', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* TAB FERMES */}
        {activeTab === 'fermes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.darker }}>Mes fermes</h2>
              <Btn onClick={() => setShowAddFarm(true)}>+ Ajouter une ferme</Btn>
            </div>

            {farms.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 40, margin: '0 0 12px' }}>🌱</p>
                <p style={{ fontSize: 16, color: '#888', margin: '0 0 20px' }}>Aucune ferme enregistrée.</p>
                <Btn onClick={() => setShowAddFarm(true)}>+ Créer ma première ferme</Btn>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {farms.map(farm => (
                  <div key={farm.id} style={{
                    background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`,
                    overflow: 'hidden', boxShadow: '0 2px 10px rgba(46,125,50,0.07)',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(46,125,50,0.13)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(46,125,50,0.07)'; }}
                  >
                    {farm.images?.[0] ? (
                      <div style={{ height: 110, overflow: 'hidden' }}>
                        <img src={`http://localhost:3000/${farm.images[0]}`} alt={farm.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ background: `linear-gradient(135deg, ${C.primary}22, ${C.dark}11)`, padding: '18px 20px 14px', borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: C.darker }}>{farm.nom}</h3>
                            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>📍 {farm.localisation}</p>
                          </div>
                          <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: `1px solid ${C.border}` }}>🏡</div>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: '14px 20px' }}>
                      {farm.images?.[0] && (
                        <div style={{ marginBottom: 10 }}>
                          <h3 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: C.darker }}>{farm.nom}</h3>
                          <p style={{ margin: 0, fontSize: 13, color: '#666' }}>📍 {farm.localisation}</p>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                        {farm.certifie && <Badge type="success">✓ Bio</Badge>}
                        <Badge>{products.filter(p => p.farmId === farm.id).length} produits</Badge>
                      </div>
                      <Btn variant="outline" small onClick={() => setSelectedFarm(farm)} style={{ width: '100%' }}>
                        Voir les détails →
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB PRODUITS */}
        {activeTab === 'produits' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.darker }}>Mes produits</h2>
              <Btn onClick={() => farms.length === 0
                ? showToast("Créez d'abord une ferme avant d'ajouter des produits.", 'error')
                : setShowAddProduct(true)
              }>
                + Ajouter un produit
              </Btn>
            </div>

            {products.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 40, margin: '0 0 12px' }}>🥬</p>
                <p style={{ fontSize: 16, color: '#888', margin: '0 0 20px' }}>Aucun produit référencé pour l'instant.</p>
                {farms.length > 0
                  ? <Btn onClick={() => setShowAddProduct(true)}>+ Ajouter mon premier produit</Btn>
                  : <p style={{ fontSize: 14, color: '#F57F17', background: '#FFF8E1', borderRadius: 9, padding: '10px 16px', display: 'inline-block', border: '1px solid #FFE082' }}>⚠ Créez d'abord une ferme</p>
                }
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                  padding: '12px 20px', background: C.lightBg, borderBottom: `1px solid ${C.border}`,
                  fontSize: 12, fontWeight: 700, color: C.dark, textTransform: 'uppercase', letterSpacing: 0.8,
                }}>
                  <span>Produit</span><span>Ferme</span><span>Prix</span><span>Stock</span><span></span>
                </div>
                {products.map((product, i) => (
                  <div key={product.id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                    padding: '14px 20px', alignItems: 'center',
                    borderBottom: i < products.length - 1 ? `1px solid ${C.border}` : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = C.lightBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: C.lightBg2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                        {product.images?.[0]
                          ? <img src={`http://localhost:3000/${product.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} />
                          : '🌿'}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#222' }}>{product.name || product.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#999' }}>{product.category || product.categorie || '—'}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: '#666' }}>{product.farm?.nom || '—'}</span>
                    <span style={{ fontWeight: 600, color: C.dark, fontSize: 14 }}>
                      {(product.price || product.prix) ? `${product.price || product.prix} Ar` : '—'}
                    </span>
                    <span>
                      {product.stock !== undefined ? (
                        <span style={{
                          fontSize: 13, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                          background: product.stock > 10 ? C.lightBg2 : product.stock > 0 ? '#FFF8E1' : '#FFEBEE',
                          color: product.stock > 10 ? C.dark : product.stock > 0 ? '#F57F17' : '#B71C1C',
                        }}>{product.stock}</span>
                      ) : '—'}
                    </span>
                    <Btn small variant="outline" onClick={() => setSelectedProduct(product)}>Détails</Btn>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddFarm && <AddFarmModal onClose={() => setShowAddFarm(false)} onSuccess={handleFarmCreated} />}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onSuccess={handleProductCreated} farms={farms} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
};

export default EspaceProducteur;