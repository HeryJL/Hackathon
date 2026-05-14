// src/components/FarmDetail/components/AlertToast.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimesCircle } from 'react-icons/fa';

export const AlertToast = ({ alert, onDismiss }) => {
  const isHigh = alert.type === 'high';
  const bg     = isHigh ? '#7C2D12' : '#1E3A5F';
  const accent = isHigh ? '#F97316' : '#3B82F6';

  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ x: 120, opacity: 0, scale: 0.92 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 120, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      onClick={onDismiss}
      style={{
        background: bg, borderRadius: 16, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${accent}40`,
        maxWidth: 340, width: '100%', cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: accent, fontSize: 16 }}>{alert.sensor.icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {isHigh ? '⚠ Valeur élevée' : '⚠ Valeur basse'} — {alert.sensor.label}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{alert.msg}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
          Valeur actuelle : <strong style={{ color: accent }}>{alert.val} {alert.sensor.unit}</strong>
        </p>
      </div>
      <FaTimesCircle size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
    </motion.div>
  );
};