import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CommunicationData, EnergyData, ISSPosition, MissionSettings, SensorReading } from '../types';
import {
  generateCommunicationData,
  generateEnergyData,
  generateSensorReading,
} from '../services/dataSimulator';
import { fetchISSPosition } from '../services/nasaApi';
import { getSettings, saveSettings } from '../services/storage';
import { DEFAULT_SETTINGS } from '../constants/thresholds';

const HISTORY_MAX = 20;

interface MissionContextValue {
  currentSensor: SensorReading | null;
  sensorHistory: SensorReading[];
  energyHistory: EnergyData[];
  communicationHistory: CommunicationData[];
  issPosition: ISSPosition | null;
  settings: MissionSettings;
  tick: number;
  updateSettings: (s: MissionSettings) => Promise<void>;
}

const MissionContext = createContext<MissionContextValue | null>(null);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [currentSensor, setCurrentSensor] = useState<SensorReading | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
  const [energyHistory, setEnergyHistory] = useState<EnergyData[]>([]);
  const [communicationHistory, setCommunicationHistory] = useState<CommunicationData[]>([]);
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [settings, setSettings] = useState<MissionSettings>(DEFAULT_SETTINGS);
  const [tick, setTick] = useState(0);

  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const runTick = useCallback(() => {
    const t = tickRef.current;
    tickRef.current += 1;

    const sensor = generateSensorReading(t);
    const energy = generateEnergyData(t);
    const comm = generateCommunicationData(t);

    setCurrentSensor(sensor);
    setSensorHistory((h) => [...h.slice(-HISTORY_MAX + 1), sensor]);
    setEnergyHistory((h) => [...h.slice(-HISTORY_MAX + 1), energy]);
    setCommunicationHistory((h) => [...h.slice(-HISTORY_MAX + 1), comm]);
    setTick(t);

    if (t % 6 === 0) {
      fetchISSPosition().then((pos) => { if (pos) setIssPosition(pos); });
    }
  }, []);

  useEffect(() => {
    runTick();
    const ms = settings.refreshInterval * 1000;
    intervalRef.current = setInterval(runTick, ms);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [runTick, settings.refreshInterval]);

  const updateSettings = useCallback(async (s: MissionSettings) => {
    setSettings(s);
    await saveSettings(s);
  }, []);

  return (
    <MissionContext.Provider value={{
      currentSensor, sensorHistory, energyHistory,
      communicationHistory, issPosition, settings, tick, updateSettings,
    }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission(): MissionContextValue {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission deve ser usado dentro de MissionProvider');
  return ctx;
}
