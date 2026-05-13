import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import {
  FaTemperatureHigh, FaWater, FaWind, FaLightbulb,
  FaTint, FaArrowLeft, FaPiggyBank, FaCogs, FaSync,
} from 'react-icons/fa';
import { GiBarn } from 'react-icons/gi';
import { COLORS as C } from '../../constants/theme';
import ProductRow from '../Product/ProductRow';

const sensorConfig = [
  { key: 'temperature', label: 'Température', unit: '°C',  min: 15,  max: 35,   color: '#E8651A', icon: <FaTemperatureHigh />, chartType: 'area' },
  { key: 'airHumidity', label: 'Humidité Air', unit: '%',  min: 40,  max: 85,   color: '#3B82F6', icon: <FaTint />,            chartType: 'area' },
  { key: 'soilMoisture',label: 'Humidité Sol', unit: '%',  min: 30,  max: 70,   color: '#22C55E', icon: <FaWater />,           chartType: 'area' },
  { key: 'light',       label: 'Luminosité',   unit: 'lux',min: 100, max: 1000, color: '#F59E0B', icon: <FaLightbulb />,      chartType: 'bar'  },
  { key: 'wind',        label: 'Vent',          unit: 'km/h',min: 0,  max: 25,  color: '#8B5CF6', icon: <FaWind />,            chartType: 'bar'  },
  { key: 'reservoir',   label: 'Cuve',          unit: '%',  min: 20,  max: 100,  color: '#06B6D4', icon: <FaWater />,           chartType: 'area' },
];

const randomValue = (min, max) => parseFloat((min + Math.random() * (max - min)).toFixed(1));

const generateRandomMeasure = (previousMeasure = null) => {
  const now = new Date();
  const measure = { ts: now.toISOString() };
  sensorConfig.forEach(sensor => {
    let value;
    if (previousMeasure && previousMeasure[sensor.key] !== undefined) {
      const prev = previousMeasure[sensor.key];
      const delta = (Math.random() - 0.5) * 0.15 * prev;
      value = Math.min(sensor.max, Math.max(sensor.min, prev + delta));
    } else {
      value = randomValue(sensor.min, sensor.max);
    }
    measure[sensor.key] = parseFloat(value.toFixed(1));
  });
  return measure;
};

const generateInitialHistory = (count, entitySeed = 0) => {
  const history = [];
  let lastMeasure = null;
  for (let i = count; i > 0; i--) {
    const ts = new Date(Date.now() - i * 60000);
    const measure = { ts: ts.toISOString() };
    sensorConfig.forEach(sensor => {
      let value;
      if (lastMeasure && lastMeasure[sensor.key] !== undefined) {
        const prev = lastMeasure[sensor.key];
        const delta = (Math.random() - 0.5) * 0.15 * prev;
        value = Math.min(sensor.max, Math.max(sensor.min, prev + delta));
      } else {
        const seed = (entitySeed + i) % 100 / 100;
        value = sensor.min + (sensor.max - sensor.min) * seed;
      }
      measure[sensor.key] = parseFloat(value.toFixed(1));
    });
    history.unshift(measure);
    lastMeasure = measure;
  }
  return history;
};

function getEntityIcon(type) {
  switch (type?.toLowerCase()) {
    case 'porcherie': return <FaPiggyBank />;
    case 'etable':    return <GiBarn />;
    default:          return <FaCogs />;
  }
}

function getStatusColor(sensor, value) {
  const ratio = (value - sensor.min) / (sensor.max - sensor.min);
  if (ratio < 0.25) return '#EF4444';
  if (ratio > 0.85) return '#F59E0B';
  return '#22C55E';
}

const FarmDetail = ({ farm, products, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const generateNewMeasure = () => {
    setHistory(prev => {
      const newMeasure = generateRandomMeasure(prev[0] || null);
      return [newMeasure, ...prev].slice(0, 60);
    });
    setLastUpdated(new Date());
  };

  useEffect(() => {
    setLoading(true);
    const seed = farm?.entity?.length || 0;
    setHistory(generateInitialHistory(60, seed));
    setLastUpdated(new Date());
    setLoading(false);
  }, [farm?.entity]);

  useEffect(() => {
    const interval = setInterval(generateNewMeasure, 30000);
    return () => clearInterval(interval);
  }, []);

  const lastMeasure = history[0] ?? {};
  const chartPoints = [...history].reverse().slice(-20);

  if (!farm) return <div style={{ padding: 40 }}>Ferme introuvable...</div>;

  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <button onClick={onBack} style={s.backBtn}>
          <FaArrowLeft size={13} /><span>Retour</span>
        </button>
        <div style={s.syncInfo}>
          <FaSync size={11} color="#22C55E" />
          <span>MAJ toutes les 30s</span>
          {lastUpdated && <span style={s.syncTime}>· {lastUpdated.toLocaleTimeString()}</span>}
        </div>
      </div>

      <div style={s.heroCard}>
        <div style={s.heroBg} />
        <div style={s.heroInner}>
          <div style={s.iconCircle}>{getEntityIcon(farm.entity)}</div>
          <div style={{ flex: 1 }}>
            <p style={s.heroSub}>{farm.entity}</p>
            <h1 style={s.heroTitle}>{farm.nom}</h1>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <span style={pill('#D1FAE5', '#065F46')}>Données simulées</span>
              {farm.certifie && <span style={pill('#FEF3C7', '#92400E')}>Bio Certifié</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={s.sectionHeader}>
        <div style={s.sectionDot} /><h2 style={s.sectionTitle}>Valeurs actuelles</h2>
      </div>

      {loading ? <div style={s.skeleton}>Chargement…</div> : (
        <div style={s.metricsGrid}>
          {sensorConfig.map(sensor => {
            const val = lastMeasure[sensor.key];
            const status = val !== undefined ? getStatusColor(sensor, val) : '#999';
            const pct = val !== undefined ? Math.round(((val - sensor.min) / (sensor.max - sensor.min)) * 100) : 0;
            return (
              <div key={sensor.key} style={s.metricCard}>
                <div style={{ ...s.metricIconWrap, background: sensor.color + '18' }}>
                  <span style={{ color: sensor.color, fontSize: 18 }}>{sensor.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={s.metricLabel}>{sensor.label}</p>
                  <p style={{ ...s.metricValue, color: sensor.color }}>
                    {val !== undefined ? val : '—'}<span style={s.metricUnit}>{sensor.unit}</span>
                  </p>
                  <div style={s.progressTrack}>
                    <div style={{ ...s.progressBar, width: `${pct}%`, background: status }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 36 }}>
        <div style={s.sectionHeader}>
          <div style={s.sectionDot} /><h2 style={s.sectionTitle}>Évolution — 20 derniers relevés</h2>
        </div>
        <div style={s.chartsGrid}>
          {sensorConfig.map(sensor => {
            const chartData = chartPoints.map(p => p[sensor.key] ?? null);
            const isBar = sensor.chartType === 'bar';
            const options = {
              chart: { id: `chart-${sensor.key}`, toolbar: { show: false }, background: 'transparent', animations: { enabled: true, speed: 600 } },
              stroke: { curve: 'smooth', width: isBar ? 0 : 2.5 },
              xaxis: {
                categories: chartPoints.map(m => new Date(m.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })),
                labels: { style: { fontSize: '9px', colors: '#94A3B8' }, rotate: -45, hideOverlappingLabels: true },
                axisBorder: { show: false }, axisTicks: { show: false },
              },
              yaxis: { min: sensor.min, max: sensor.max, labels: { style: { fontSize: '10px', colors: '#94A3B8' }, formatter: v => v !== undefined ? v.toFixed(0) : '' } },
              colors: [sensor.color],
              fill: isBar ? { opacity: 0.85 } : { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] } },
              plotOptions: isBar ? { bar: { borderRadius: 4, columnWidth: '60%' } } : {},
              grid: { borderColor: '#F1F5F9', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: -10, right: 8, bottom: 0, left: 8 } },
              dataLabels: { enabled: false },
              tooltip: { theme: 'light', y: { formatter: v => `${v} ${sensor.unit}` } },
              markers: isBar ? {} : { size: 3, colors: [sensor.color], strokeColors: '#fff', strokeWidth: 2, hover: { size: 5 } },
              legend: { show: false },
            };
            return (
              <div key={sensor.key} style={s.chartCard}>
                <div style={s.chartHeader}>
                  <div style={{ ...s.chartIconBadge, background: sensor.color + '15' }}>
                    <span style={{ color: sensor.color, fontSize: 14 }}>{sensor.icon}</span>
                  </div>
                  <div>
                    <p style={s.chartLabel}>{sensor.label}</p>
                    <p style={{ ...s.chartCurrentVal, color: sensor.color }}>
                      {lastMeasure[sensor.key] !== undefined ? lastMeasure[sensor.key] : '—'}
                      <span style={s.chartUnit}> {sensor.unit}</span>
                    </p>
                  </div>
                  <span style={{ ...s.chartTypeBadge, background: isBar ? '#FEF3C7' : '#EFF6FF', color: isBar ? '#92400E' : '#1D4ED8' }}>
                    {isBar ? 'Barres' : 'Courbe'}
                  </span>
                </div>
                <Chart options={options} series={[{ name: sensor.label, data: chartData }]} type={isBar ? 'bar' : 'area'} height={190} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 36 }}>
        <div style={s.sectionHeader}>
          <div style={s.sectionDot} /><h2 style={s.sectionTitle}>Produits associés</h2>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {products.filter(p => p.farmId === farm.id).length > 0
            ? products.filter(p => p.farmId === farm.id).map(p => <ProductRow key={p.id} product={p} />)
            : <p style={{ color: '#94A3B8', padding: '20px 0' }}>Aucun produit pour cette ferme.</p>}
        </div>
      </div>
    </div>
  );
};

const pill = (bg, text) => ({ background: bg, color: text, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, display: 'inline-block' });

const s = {
  root: { padding: '10px 0', fontFamily: "'Inter', system-ui, sans-serif" },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 },
  backBtn: { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#475569', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' },
  syncInfo: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8' },
  syncTime: { color: '#CBD5E1' },
  heroCard: { position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 28, boxShadow: '0 4px 20px rgba(34,197,94,0.12)' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #14532D 0%, #166534 40%, #15803D 100%)', zIndex: 0 },
  heroInner: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '28px 32px', flexWrap: 'wrap' },
  iconCircle: { width: 64, height: 64, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', flexShrink: 0 },
  heroSub: { margin: 0, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  heroTitle: { margin: '4px 0 0', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionDot: { width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#1E293B', margin: 0, letterSpacing: '-0.01em' },
  skeleton: { padding: 30, textAlign: 'center', background: '#F8FAFC', borderRadius: 14, color: '#CBD5E1' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  metricCard: { background: '#fff', border: '1px solid #F1F5F9', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  metricIconWrap: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  metricLabel: { margin: 0, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' },
  metricValue: { margin: '3px 0 8px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 },
  metricUnit: { fontSize: 12, fontWeight: 400, marginLeft: 3, color: '#94A3B8' },
  progressTrack: { height: 3, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 },
  chartCard: { background: '#fff', border: '1px solid #F1F5F9', borderRadius: 18, padding: '16px 16px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' },
  chartHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  chartIconBadge: { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chartLabel: { margin: 0, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' },
  chartCurrentVal: { margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' },
  chartUnit: { fontSize: 11, fontWeight: 400, color: '#94A3B8' },
  chartTypeBadge: { marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, flexShrink: 0 },
};

export default FarmDetail;