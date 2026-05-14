// src/components/FarmDetail/components/ActuatorPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaPlug, FaFan, FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import { SectionHeader } from '../../utils/utils';

export const ActuatorPanel = ({ lastMeasure }) => {
  const { pump, fan, vents } = lastMeasure;
  if (pump === undefined && fan === undefined && vents === undefined) return null;

  const items = [
    pump !== undefined && {
      label: 'Pompe',
      icon: <FaPlug size={15} />,
      active: pump,
      onColor: '#22C55E', offColor: '#94A3B8',
      onLabel: 'Active', offLabel: 'Arrêtée',
    },
    fan !== undefined && {
      label: 'Ventilateur',
      icon: <FaFan size={15} />,
      active: fan,
      onColor: '#3B82F6', offColor: '#94A3B8',
      onLabel: 'Actif', offLabel: 'Arrêté',
      spin: fan,
    },
    vents !== undefined && {
      label: 'Ventelles',
      icon: vents === 'open' ? <FaDoorOpen size={15} /> : <FaDoorClosed size={15} />,
      active: vents === 'open',
      onColor: '#F59E0B', offColor: '#64748B',
      onLabel: 'Ouvertes', offLabel: 'Fermées',
    },
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      style={{ marginBottom: 32 }}
    >
      <SectionHeader title="État des actionneurs" />
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            animate={item.active ? { boxShadow: [`0 0 0 0 ${item.onColor}40`, `0 0 0 8px ${item.onColor}00`] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              background: '#fff', borderRadius: 16,
              border: `1.5px solid ${item.active ? item.onColor + '60' : '#F1F5F9'}`,
              padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: item.active ? `0 4px 20px ${item.onColor}20` : '0 2px 8px rgba(0,0,0,0.04)',
              minWidth: 160,
            }}
          >
            <motion.div
              animate={item.spin ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: item.active ? `${item.onColor}18` : '#F9FAFB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.active ? item.onColor : '#94A3B8',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </motion.div>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 800, color: item.active ? item.onColor : '#94A3B8' }}>
                {item.active ? item.onLabel : item.offLabel}
              </p>
            </div>
            <motion.div
              animate={item.active ? { opacity: [1, 0.3, 1] } : { opacity: 0.3 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: item.active ? item.onColor : '#E2E8F0', marginLeft: 'auto', flexShrink: 0 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};