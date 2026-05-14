/* eslint-disable react-hooks/immutability */
// src/components/FarmDetail/hooks/useNodeRedWS.js
import { useRef, useEffect, useCallback } from 'react';

const WS_URL = 'ws://localhost:1880/ws/sensor';

export  default function useNodeRedWS({ entity, onMessage, onStatus }) {
  const wsRef      = useRef(null);
  const retryRef   = useRef(null);
  const retryCount = useRef(0);
  const onMsg      = useRef(onMessage);
  const onSt       = useRef(onStatus);
  
  useEffect(() => { onMsg.current = onMessage; }, [onMessage]);
  useEffect(() => { onSt.current  = onStatus;  }, [onStatus]);

  const connect = useCallback(() => {
    clearTimeout(retryRef.current);
    if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }

    onSt.current('connecting');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => { retryCount.current = 0; onSt.current('connected'); };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        // Filtre : accepte si entity correspond OU si pas de entity dans le payload
        if (data.entity && entity && data.entity.toLowerCase() !== entity.toLowerCase()) return;
        onMsg.current({ ...data, ts: data.ts ?? new Date().toISOString() });
      } catch {
        /* ignore non-JSON */
      }
    };

    ws.onerror = () => onSt.current('error');

    ws.onclose = () => {
      onSt.current('disconnected');
      const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
      retryCount.current++;
      retryRef.current = setTimeout(connect, delay);
    };
  }, [entity]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(retryRef.current);
      if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }
    };
  }, [connect]);

  return { reconnect: connect };
}