// src/components/FarmDetail/config/sensorConfig.js
import { FaTemperatureHigh, FaWater, FaTint, FaLightbulb, FaWind } from 'react-icons/fa';
import { GiPlantWatering } from 'react-icons/gi';

export const sensorConfig = [
  {
    key: 'temperature', label: 'Température', unit: '°C', min: 10, max: 45,
    color: '#E8651A', icon: <FaTemperatureHigh />, chartType: 'area',
    thresholds: { low: 17, high: 32 },
    alertLow:  'Température trop basse — risque de gel',
    alertHigh: 'Température trop élevée — stress thermique',
  },
  {
    key: 'airHumidity', label: 'Humidité air', unit: '%', min: 20, max: 100,
    color: '#3B82F6', icon: <FaTint />, chartType: 'area',
    thresholds: { low: 45, high: 80 },
    alertLow:  "Humidité de l'air trop basse",
    alertHigh: 'Risque de condensation et moisissures',
  },
  {
    key: 'soilMoisture', label: 'Humidité sol', unit: '%', min: 0, max: 100,
    color: '#22C55E', icon: <FaWater />, chartType: 'area',
    thresholds: { low: 35, high: 65 },
    alertLow:  'Sol trop sec — irrigation recommandée',
    alertHigh: 'Sol saturé — risque de pourriture',
  },
  {
    key: 'light', label: 'Luminosité', unit: 'lux', min: 0, max: 1000,
    color: '#F59E0B', icon: <FaLightbulb />, chartType: 'bar',
    thresholds: { low: 150, high: 900 },
    alertLow:  'Luminosité insuffisante pour la croissance',
    alertHigh: 'Exposition lumineuse trop intense',
  },
  {
    key: 'wind', label: 'Vent', unit: 'km/h', min: 0, max: 25,
    color: '#8B5CF6', icon: <FaWind />, chartType: 'bar',
    thresholds: { low: null, high: 22 },
    alertHigh: 'Vent fort — sécuriser les structures',
  },
  {
    key: 'reservoir', label: 'Cuve', unit: '%', min: 0, max: 100,
    color: '#06B6D4', icon: <GiPlantWatering />, chartType: 'area',
    thresholds: { low: 25, high: null },
    alertLow: 'Niveau de cuve critique — remplissage urgent',
  },
];