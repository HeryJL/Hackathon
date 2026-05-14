// src/components/FarmDetail/components/ChartCard.jsx
import React from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';

export const ChartCard = ({ sensor, chartPoints, lastValue }) => {
  const hasData = chartPoints.some(p => p[sensor.key] !== undefined && p[sensor.key] !== null);
  if (!hasData) return null;

  const isBar     = sensor.chartType === 'bar';
  const chartData = chartPoints.map(p => p[sensor.key] ?? null);

  const options = {
    chart: { toolbar: { show: false }, background: 'transparent', animations: { enabled: true, speed: 500 } },
    stroke: { curve: 'smooth', width: isBar ? 0 : 2.5 },
    xaxis: {
      categories: chartPoints.map(m =>
        new Date(m.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      ),
      labels: { style: { fontSize: '9px', colors: '#94A3B8' }, rotate: -30, hideOverlappingLabels: true },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      min: sensor.min, max: sensor.max,
      labels: { style: { fontSize: '9px', colors: '#94A3B8' }, formatter: v => v != null ? v.toFixed(0) : '' },
    },
    colors: [sensor.color],
    fill: isBar
      ? { opacity: 0.85 }
      : { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] } },
    plotOptions: isBar ? { bar: { borderRadius: 5, columnWidth: '55%' } } : {},
    grid: { borderColor: '#F8FAFC', strokeDashArray: 3, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: -10, right: 6, bottom: 0, left: 6 } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light', y: { formatter: v => `${v} ${sensor.unit}` } },
    markers: isBar ? {} : { size: 3, colors: [sensor.color], strokeColors: '#fff', strokeWidth: 2, hover: { size: 5 } },
    legend: { show: false },
    annotations: sensor.thresholds?.high ? {
      yaxis: [{
        y: sensor.thresholds.high, borderColor: '#EF4444', borderWidth: 1.5, strokeDashArray: 4,
        label: { text: 'Max', style: { background: '#FEF2F2', color: '#EF4444', fontSize: '9px', fontWeight: 700 } },
      }],
    } : undefined,
  };

  return (
    <motion.div whileHover={{ y: -3 }}
      style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 20, padding: '18px 18px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${sensor.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: sensor.color, fontSize: 15 }}>{sensor.icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sensor.label}</p>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: sensor.color, letterSpacing: '-0.01em' }}>
            {lastValue !== undefined && lastValue !== null ? lastValue : '—'}
            <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8', marginLeft: 3 }}>{sensor.unit}</span>
          </p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: isBar ? '#FEF3C7' : '#EFF6FF', color: isBar ? '#92400E' : '#1D4ED8' }}>
          {isBar ? 'Barres' : 'Courbe'}
        </span>
      </div>
      <Chart options={options} series={[{ name: sensor.label, data: chartData }]} type={isBar ? 'bar' : 'area'} height={175} />
    </motion.div>
  );
};