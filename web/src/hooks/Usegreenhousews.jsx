// src/hooks/useGreenhouseWS.js
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL =
  (import.meta.env.VITE_WS_URL || `ws://localhost:4000`) +
  `/ws/greenhouse?client=frontend`;

export function useGreenhouseWS() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'
  const ws = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    setStatus('connecting');
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      setStatus('connected');
      clearTimeout(reconnectTimer.current);
    };

    ws.current.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        if (type === 'MEASUREMENT') {
          setLatest(payload);
          setHistory((prev) => [payload, ...prev].slice(0, 200)); // garder 200 pts max
        }
      } catch (err) {
        console.error('Erreur parsing WS message:', err);
      }
    };

    ws.current.onclose = () => {
      setStatus('disconnected');
      // Reconnexion automatique après 3s
      // eslint-disable-next-line react-hooks/immutability
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  return { latest, history, status };
}