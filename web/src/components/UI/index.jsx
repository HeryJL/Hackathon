import React, { useState } from 'react';
import { COLORS as C } from '../../constants/theme';

export const StatCard = ({ icon, label, value, sub }) => (
  <div style={{
    background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`,
    padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 2px 10px rgba(46,125,50,0.07)',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, fontSize: 22,
      background: C.lightBg2, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</p>
      <p style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 700, color: C.darker }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: 12, color: C.medium }}>{sub}</p>}
    </div>
  </div>
);

export const Badge = ({ children, type = 'default' }) => {
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
      display: 'inline-block', padding: '3px 11px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 12, fontWeight: 600,
    }}>{children}</span>
  );
};

export const Btn = ({ children, onClick, variant = 'primary', small, disabled, style: extra }) => {
  const [hov, setHov] = useState(false);
  const base = {
    border: 'none', borderRadius: small ? 7 : 10, cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: small ? 13 : 14, fontWeight: 600, transition: 'all 0.18s', opacity: disabled ? 0.55 : 1,
    padding: small ? '6px 14px' : '10px 22px', ...extra,
  };
  const variants = {
    primary: { background: hov ? C.hover : C.primary, color: '#fff' },
    outline: { background: hov ? C.lightBg2 : 'transparent', color: C.dark, border: `1.5px solid ${C.primary}` },
    ghost: { background: hov ? '#f5f5f5' : 'transparent', color: '#555', border: '1.5px solid #ddd' },
    danger: { background: hov ? '#c62828' : '#e53935', color: '#fff' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
};