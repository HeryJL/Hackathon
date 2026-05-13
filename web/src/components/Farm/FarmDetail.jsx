import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import {
  FaTemperatureHigh, FaWater, FaWind, FaLightbulb,
  FaTint, FaArrowLeft, FaPiggyBank, FaCogs, FaClock, FaSync
} from 'react-icons/fa';
import { GiBarn } from 'react-icons/gi';
import { COLORS as C } from '../../constants/theme';
import { Badge } from '../UI';
import ProductRow from '../Product/ProductRow';
import api from '../../service/api';

// Configuration des capteurs pour l'affichage
const sensorConfig = [
  { key: 'temperature', label: 'Température', unit: '°C',    icon: <FaTemperatureHigh color="#ff9800" /> },
  { key: 'airHumidity', label: 'Humidité Air', unit: '%',    icon: <FaWater color="#2196f3" /> },
  { key: 'soilMoisture',label: 'Humidité Sol', unit: '%',    icon: <FaTint color="#4caf50" /> },
  { key: 'light',        label: 'Luminosité',  unit: 'lux',  icon: <FaLightbulb color="#fbc02d" /> },
  { key: 'wind',         label: 'Vent',        unit: 'km/h', icon: <FaWind color="#9e9e9e" /> },
  { key: 'reservoir',    label: 'Cuve',        unit: '%',    icon: <FaWater color="#00bcd4" /> },
];

function getEntityIcon(type) {
  switch (type?.toLowerCase()) {
    case 'porcherie': return <FaPiggyBank />;
    case 'etable':    return <GiBarn />;
    default:          return <FaCogs />;
  }
}

const FarmDetail = ({ farm, products, onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 1. Fonction de récupération des données (BDD uniquement)
  const fetchFarmData = async () => {
    if (!farm?.entity) return;
    
    try {
      // Appel à ta route : router.get('/history', greenhouseController.getHistory)
      const res = await api.get('/greenhouse/history?limit=60');
      const allData = res.data ?? [];
      console.log(allData);

      // Filtrage sécurisé pour l'entité de cette ferme
      const forFarm = allData.filter(m =>
        m?.entity?.trim().toLowerCase() === farm.entity?.trim().toLowerCase()
      );
      
      setHistory(forFarm);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Erreur lors de la récupération des données :', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Mise en place du Polling (15 secondes)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchFarmData(); // Chargement initial

    const interval = setInterval(() => {
      fetchFarmData();
    }, 15000);

    return () => clearInterval(interval); // Nettoyage au démontage
  }, [farm?.entity]);

  // Extraction de la dernière mesure pour les cartes du haut
  const lastMeasure = history[0] ?? {};

  // Capteurs qui possèdent réellement des données
  const activeSensors = sensorConfig.filter(s =>
    lastMeasure[s.key] !== null && lastMeasure[s.key] !== undefined
  );

  // ── Configuration du Graphique ─────────────────────────────────────────────
  const chartPoints = [...history].reverse().slice(-20);

  const chartOptions = {
    chart: {
      id: `farm-chart-${farm?.id}`,
      toolbar: { show: false },
      background: 'transparent',
      animations: { enabled: true, easing: 'linear' }
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: chartPoints.map(m =>
        new Date(m.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      ),
      labels: { style: { colors: '#999' } }
    },
    colors: [C.primary, '#2196f3', '#4caf50'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 }
    },
    grid: { borderColor: '#f1f1f1' }
  };

  const chartSeries = activeSensors.slice(0, 3).map(s => ({
    name: s.label,
    data: chartPoints.map(m => m[s.key] ?? null),
  }));

  const farmProducts = products.filter(p => p.farmId === farm.id);

  if (!farm) return <div style={{ padding: 40 }}>Ferme introuvable...</div>;

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Barre supérieure */}
      <div style={s.topBar}>
        <button onClick={onBack} style={s.backBtn}><FaArrowLeft /> Retour</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#666', fontSize: 13 }}>
            <FaSync className={loading ? 'fa-spin' : ''} color={C.primary} />
            MAJ toutes les 15s
          </div>
          {lastUpdated && (
            <span style={{ fontSize: 13, color: '#999' }}>
              Dernière : {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ ...s.heroCard, background: `linear-gradient(135deg, ${C.primary}, ${C.darker})` }}>
        <div style={s.iconCircle}>{getEntityIcon(farm.entity)}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{farm.nom}</h1>
          <p style={{ margin: '4px 0 12px', opacity: 0.85 }}>Entité : {farm.entity}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge type="info">Base de données</Badge>
            {farm.certifie && <Badge type="success">Bio Certifié</Badge>}
          </div>
        </div>
      </div>

      {/* Section Capteurs */}
      <h3 style={s.sectionTitle}>Données actuelles</h3>
      {loading && history.length === 0 ? (
        <div style={s.emptyState}>Chargement des données...</div>
      ) : activeSensors.length === 0 ? (
        <div style={s.emptyState}>Aucune donnée trouvée en BDD pour "{farm.entity}"</div>
      ) : (
        <div style={s.metricsGrid}>
          {activeSensors.map(sensor => (
            <div key={sensor.key} style={s.metricCard}>
              <div style={s.sensorIcon}>{sensor.icon}</div>
              <div>
                <p style={s.label}>{sensor.label}</p>
                <p style={s.value}>
                  {lastMeasure[sensor.key]}
                  <small style={s.unit}>{sensor.unit}</small>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Graphique d'historique */}
      {history.length > 1 && (
        <div style={s.chartContainer}>
          <h3 style={{ ...s.sectionTitle, marginTop: 0 }}>Évolution (20 derniers relevés)</h3>
          <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
        </div>
      )}

      {/* Liste des produits */}
      <div style={{ marginTop: 30 }}>
        <h3 style={s.sectionTitle}>Produits associés</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {farmProducts.length > 0 ? (
            farmProducts.map(p => <ProductRow key={p.id} product={p} />)
          ) : (
            <p style={{ color: '#999' }}>Aucun produit pour cette ferme.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  topBar:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn:   { background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: '8px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
  heroCard:  { borderRadius: 20, padding: 25, color: '#fff', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 25 },
  iconCircle:{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 15, marginBottom: 25 },
  metricCard:  { background: '#fff', padding: 15, borderRadius: 15, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12 },
  sensorIcon:  { width: 40, height: 40, background: '#f9f9f9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  label:     { margin: 0, fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase' },
  value:     { margin: 0, fontSize: 18, fontWeight: 700, color: '#2e7d32' },
  unit:      { fontSize: 12, fontWeight: 400, marginLeft: 3, color: '#666' },
  chartContainer: { background: '#fff', padding: 20, borderRadius: 20, border: '1px solid #eee' },
  sectionTitle:   { fontSize: 18, fontWeight: 800, color: '#1b5e20', marginBottom: 15 },
  emptyState:     { padding: 30, textAlign: 'center', background: '#f5f5f5', borderRadius: 15, color: '#999' }
};

export default FarmDetail;