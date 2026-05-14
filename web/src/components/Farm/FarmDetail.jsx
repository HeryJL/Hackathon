// src/components/FarmDetail/FarmDetail.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaSync, FaBell, FaEdit } from 'react-icons/fa';
import ProductRow from '../Product/ProductRow';
import useNodeRedWS from '../../hooks/useNodeRedWS'
import { sensorConfig } from '../../config/sensorConfig';
import { getEntityIcon, checkAlerts, statusMap, SectionHeader, pillStyle } from '../../utils/utils';
import { ActuatorPanel } from './ActuatorPanel';
import { AlertToast } from './AlertToast';
import { MetricCard } from './MetricCard';
import { ChartCard } from './ChartCard';
import { EditFarmModal } from './EditFarmModal';

const FarmDetail = ({ farm, products, onBack, onFarmUpdate }) => {
  const [history, setHistory] = useState([]);
  const [seenKeys, setSeenKeys] = useState(new Set());
  const [wsStatus, setWsStatus] = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const toastId = useRef(0);
  const alertCooldown = useRef({});

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const addAlert = useCallback((alert) => {
    const now = Date.now();
    const key = alert.sensor.key;
    if (alertCooldown.current[key] && now - alertCooldown.current[key] < 30000) return;
    alertCooldown.current[key] = now;
    const id = ++toastId.current;
    setToasts(prev => [...prev.slice(-3), { ...alert, id }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleMessage = useCallback((data) => {
    setSeenKeys(prev => {
      const next = new Set(prev);
      sensorConfig.forEach(s => { if (data[s.key] !== undefined) next.add(s.key); });
      return next;
    });
    setHistory(prev => [data, ...prev].slice(0, 60));
    setLastUpdated(new Date());
    const alerts = checkAlerts(data);
    alerts.forEach(a => addAlert(a));
  }, [addAlert]);

  const { reconnect } = useNodeRedWS({
    entity: farm?.entity,
    onMessage: handleMessage,
    onStatus: setWsStatus,
  });

  useEffect(() => {
    setHistory([]);
    setSeenKeys(new Set());
    setToasts([]);
    alertCooldown.current = {};
  }, [farm?.entity]);

  const lastMeasure = history[0] ?? {};
  const chartPoints = [...history].reverse().slice(-20);
  const s = statusMap[wsStatus] || statusMap.connecting;
  const visibleSensors = sensorConfig.filter(sc => seenKeys.has(sc.key));

  if (!farm) return <div style={{ padding: 40, color: '#94A3B8' }}>Ferme introuvable…</div>;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", position: 'relative' }}>
      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 28, right: isMobile ? 12 : 28, zIndex: 4000, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', maxWidth: 360, width: '90vw' }}>
        <AnimatePresence>
          {toasts.map(t => (
            <AlertToast key={t.id} alert={t} onDismiss={() => dismissToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }} onClick={onBack}
          style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '9px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <FaArrowLeft size={12} /> Retour
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <AnimatePresence>
            {toasts.length > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#DC2626' }}>
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <FaBell size={12} />
                </motion.span>
                {toasts.length} alerte{toasts.length > 1 ? 's' : ''}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button whileTap={{ scale: 0.96 }} onClick={reconnect}
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: 10, padding: '7px 14px', cursor: 'pointer' }}>
            <motion.div
              animate={wsStatus === 'connected' ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }}
            />
            {s.label}
          </motion.button>

          {lastUpdated && (
            <span style={{ fontSize: 11, color: '#94A3B8' }}>MAJ : {lastUpdated.toLocaleTimeString('fr-FR')}</span>
          )}
        </div>
      </div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', marginBottom: 36, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', minHeight: isMobile ? 340 : 440 }}>
        {farm.images?.[0] ? (
          <img src={`http://localhost:3000/${farm.images[0]}`} alt={farm.nom}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #14532D 0%, #166534 45%, #15803D 100%)' }}>
            <div style={{ position: 'absolute', right: -60, top: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.82) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: isMobile ? '28px 22px' : '40px 44px' }}>
          <div style={{ position: 'absolute', top: isMobile ? 18 : 24, right: isMobile ? 18 : 28, display: 'flex', gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(12px)',
                borderRadius: 999,
                padding: '7px 12px',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <FaEdit size={14} />
              Modifier
            </motion.button>
            <motion.div animate={wsStatus === 'connected' ? { opacity: [1, 0.5, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', borderRadius: 999, padding: '7px 16px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, boxShadow: wsStatus === 'connected' ? `0 0 8px ${s.dot}` : 'none' }} />
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{s.label}</span>
            </motion.div>
          </div>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', marginBottom: 14 }}>
            {getEntityIcon(farm.entity)}
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {farm.entity || 'Ferme'}
          </p>
          <h1 style={{ margin: '0 0 10px', fontSize: isMobile ? 28 : 42, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, textShadow: '0 2px 12px rgba(0,0,0,0.4)', maxWidth: 600 }}>
            {farm.nom}
          </h1>
          {farm.localisation && (
            <p style={{ margin: '0 0 18px', fontSize: 14, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 {farm.localisation}
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={pillStyle('rgba(52,211,153,0.2)', '#6EE7B7', '1px solid rgba(52,211,153,0.35)')}>
              {visibleSensors.length} capteur{visibleSensors.length !== 1 ? 's' : ''} actif{visibleSensors.length !== 1 ? 's' : ''}
            </span>
            {farm.certifie && <span style={pillStyle('rgba(251,191,36,0.2)', '#FDE68A', '1px solid rgba(251,191,36,0.35)')}>🌿 Bio Certifié</span>}
            {history.length > 0 && (
              <span style={pillStyle('rgba(255,255,255,0.12)', 'rgba(255,255,255,0.85)', '1px solid rgba(255,255,255,0.2)')}>
                {history.length} relevé{history.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Attente données */}
      {history.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '50px 24px', textAlign: 'center', background: '#F9FAFB', borderRadius: 20, border: '1.5px dashed #E5E7EB', marginBottom: 32 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
            <FaSync size={28} color="#94A3B8" style={{ margin: '0 auto 14px', display: 'block' }} />
          </motion.div>
          <p style={{ color: '#94A3B8', fontSize: 14, margin: 0 }}>
            {wsStatus === 'connected' ? 'En attente des données Node-RED…' : `WebSocket : ${s.label}`}
          </p>
          <p style={{ color: '#CBD5E1', fontSize: 12, margin: '6px 0 0' }}>
            URL : <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>ws://localhost:1880/ws/sensor</code>
          </p>
        </motion.div>
      )}

      {/* Actionneurs */}
      {history.length > 0 && <ActuatorPanel lastMeasure={lastMeasure} />}

      {/* Métriques */}
      {visibleSensors.length > 0 && (
        <>
          <SectionHeader title="Valeurs actuelles" />
          <motion.div
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(210px, 1fr))', gap: isMobile ? 10 : 14, marginBottom: 36 }}
          >
            {visibleSensors.map(sensor => (
              <motion.div key={sensor.key} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <MetricCard sensor={sensor} value={lastMeasure[sensor.key]} seen={seenKeys.has(sensor.key)} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* Graphiques + Produits */}
      {history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div>
            <SectionHeader title={`Évolution — ${chartPoints.length} derniers relevés`} />
            <motion.div initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              style={{ display: 'grid', gap: 18 }}>
              {sensorConfig.map(sensor => (
                <motion.div key={sensor.key} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ChartCard sensor={sensor} chartPoints={chartPoints} lastValue={lastMeasure[sensor.key]} />
                </motion.div>
              ))}
            </motion.div>
          </div>
          {!isMobile && (
            <div style={{ position: 'sticky', top: 80 }}>
              <SectionHeader title="Produits associés" />
              {(() => {
                const fp = products.filter(p => p.farmId === farm.id);
                return (
                  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280' }}>{fp.length} produit{fp.length !== 1 ? 's' : ''}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#ECFDF5', color: '#065F46', padding: '3px 10px', borderRadius: 999 }}>
                        Stock : {fp.reduce((s, p) => s + (p.stock || 0), 0)}
                      </span>
                    </div>
                    <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', padding: '8px 0' }}>
                      {fp.length > 0 ? fp.map((p, i) => (
                        <motion.div key={p.id}
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                          whileHover={{ background: '#F9FAFB' }}
                          style={{ padding: '12px 18px', borderBottom: i < fp.length - 1 ? '1px solid #F9FAFB' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {p.images?.[0] ? <img src={`http://localhost:3000/${p.images[0]}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span>🌿</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name || p.nom}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>
                                {p.price || p.prix} Ar · stock : <strong style={{ color: (p.stock || 0) > 10 ? '#059669' : '#F59E0B' }}>{p.stock || 0}</strong>
                              </p>
                            </div>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: (p.stock || 0) > 10 ? '#22C55E' : '#F59E0B', flexShrink: 0 }} />
                          </div>
                        </motion.div>
                      )) : (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>
                          <p style={{ fontSize: 28, margin: '0 0 8px' }}>🌱</p>
                          <p style={{ fontSize: 13, margin: 0 }}>Aucun produit</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {isMobile && history.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <SectionHeader title="Produits associés" />
          {products.filter(p => p.farmId === farm.id).map(p => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
              <ProductRow product={p} />
            </motion.div>
          ))}
        </div>
      )}

      {showEditModal && (
       <EditFarmModal
  farm={farm}
  onClose={() => setShowEditModal(false)}
  onSuccess={(updatedFarm) => {
    if (onFarmUpdate) onFarmUpdate(updatedFarm);
  }}
/>
      )}
    </div>
  );
};

export default FarmDetail;