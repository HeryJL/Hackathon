/* eslint-disable react-refresh/only-export-components */
// src/components/FarmDetail/utils/utils.js
import { FaPiggyBank, FaCogs } from 'react-icons/fa';
import { GiBarn } from 'react-icons/gi';
import { sensorConfig } from '../config/sensorConfig';

// eslint-disable-next-line react-refresh/only-export-components
export const getEntityIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'porcherie': return <FaPiggyBank />;
    case 'etable':    return <GiBarn />;
    case 'serre':     return <span style={{ fontSize: '1em' }}>🌿</span>;
    default:          return <FaCogs />;
  }
};

export const getStatusColor = (sensor, value) => {
  if (value === undefined || value === null) return '#94A3B8';
  const { thresholds, min, max } = sensor;
  if (thresholds?.low  != null && value <= thresholds.low)  return '#EF4444';
  if (thresholds?.high != null && value >= thresholds.high) return '#F59E0B';
  const ratio = (value - min) / (max - min);
  if (ratio < 0.1) return '#EF4444';
  if (ratio > 0.9) return '#F59E0B';
  return '#22C55E';
};

export const checkAlerts = (measure) => {
  const alerts = [];
  sensorConfig.forEach(s => {
    const val = measure[s.key];
    if (val === undefined || val === null) return;
    if (s.thresholds?.low  != null && val <= s.thresholds.low)  alerts.push({ sensor: s, val, type: 'low',  msg: s.alertLow });
    if (s.thresholds?.high != null && val >= s.thresholds.high) alerts.push({ sensor: s, val, type: 'high', msg: s.alertHigh });
  });
  return alerts;
};

export const statusMap = {
  connected:    { label: 'Connecté',    dot: '#22C55E', bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' },
  connecting:   { label: 'Connexion…', dot: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
  disconnected: { label: 'Déconnecté', dot: '#EF4444', bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
  error:        { label: 'Erreur WS',  dot: '#EF4444', bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
};

export const SectionHeader = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
    <div style={{ width: 5, height: 20, borderRadius: 99, background: 'linear-gradient(180deg, #22C55E, #16A34A)' }} />
    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
  </div>
);

export const pillStyle = (bg, color, border = 'transparent') => ({
  background: bg, color, border: `1px solid ${border}`,
  fontSize: 11, fontWeight: 700, padding: '5px 12px',
  borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4,
  backdropFilter: 'blur(8px)',
});