// src/components/FarmDetail/components/MetricCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { getStatusColor } from '../../utils/utils'; 

export const MetricCard = ({ sensor, value, seen }) => {
  if (!seen) return null;

  const status  = getStatusColor(sensor, value);
  const pct     = value !== undefined && value !== null
    ? Math.max(0, Math.min(100, Math.round(((value - sensor.min) / (sensor.max - sensor.min)) * 100)))
    : 0;
  const isAlert = value !== undefined && value !== null && (
    (sensor.thresholds?.low  != null && value <= sensor.thresholds.low) ||
    (sensor.thresholds?.high != null && value >= sensor.thresholds.high)
  );

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      style={{
        background: '#fff', borderRadius: 18,
        border: isAlert ? `1.5px solid ${status}60` : '1px solid #F1F5F9',
        padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12,
        boxShadow: isAlert ? `0 4px 20px ${status}20` : '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.3s ease',
      }}
    >
      {isAlert && (
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: status }}
        />
      )}
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${sensor.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: sensor.color, fontSize: 18 }}>{sensor.icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sensor.label}</p>
        <p style={{ margin: '4px 0 10px', fontSize: 24, fontWeight: 800, color: sensor.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
          {value !== undefined && value !== null ? value : '—'}
          <span style={{ fontSize: 12, fontWeight: 500, color: '#94A3B8', marginLeft: 4 }}>{sensor.unit}</span>
        </p>
        <div style={{ height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            key={pct}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: 99, background: status }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#CBD5E1' }}>{sensor.min}{sensor.unit}</span>
          <span style={{ fontSize: 9, color: '#CBD5E1' }}>{sensor.max}{sensor.unit}</span>
        </div>
      </div>
    </motion.div>
  );
};