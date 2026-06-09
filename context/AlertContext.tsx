import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from '../types';
import { evaluateAlerts } from '../services/alertEngine';
import { getAlerts, saveAlerts } from '../services/storage';
import { useMission } from './MissionContext';

const ALERTS_MAX = 50;

interface AlertContextValue {
  alerts: Alert[];
  unacknowledgedCount: number;
  acknowledgeAlert: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { currentSensor, settings, tick } = useMission();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  useEffect(() => {
    if (!currentSensor) return;
    const newAlerts = evaluateAlerts(currentSensor, settings.thresholds);
    if (newAlerts.length === 0) return;

    setAlerts((prev) => {
      const merged = [...newAlerts, ...prev].slice(0, ALERTS_MAX);
      saveAlerts(merged);
      return merged;
    });
  }, [tick, currentSensor, settings.thresholds]);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a));
      saveAlerts(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
    saveAlerts([]);
  }, []);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <AlertContext.Provider value={{ alerts, unacknowledgedCount, acknowledgeAlert, clearAll }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts deve ser usado dentro de AlertProvider');
  return ctx;
}
