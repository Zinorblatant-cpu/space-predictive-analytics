import { CommunicationData, EnergyData, SensorReading } from '../types';
import { CMAPSS_BASELINE } from '../constants/sampleData';

function jitter(value: number, pct = 0.04): number {
  return value * (1 + (Math.random() - 0.5) * pct);
}

export function generateSensorReading(tick: number): SensorReading {
  const base = CMAPSS_BASELINE[tick % CMAPSS_BASELINE.length];
  return {
    timestamp: Date.now(),
    temperature: Math.round(jitter(base.temperature, 0.06) * 10) / 10,
    pressure: Math.round(jitter(base.pressure, 0.04) * 1000) / 1000,
    vibration: Math.round(jitter(base.vibration, 0.08) * 100) / 100,
    humidity: Math.round(jitter(base.humidity, 0.05)),
    altitude: Math.round(jitter(base.altitude, 0.02) * 10) / 10,
    solarOutput: Math.min(100, Math.max(0, Math.round(jitter(base.solarOutput, 0.06)))),
    signalQuality: Math.min(100, Math.max(0, Math.round(jitter(base.signalQuality, 0.08)))),
    rul: Math.min(100, Math.max(0, Math.round(jitter(base.rul, 0.05)))),
  };
}

export function generateEnergyData(tick: number): EnergyData {
  const base = CMAPSS_BASELINE[tick % CMAPSS_BASELINE.length];
  const battery = Math.min(100, Math.max(0, Math.round(jitter(base.rul, 0.06))));
  const solar = Math.min(100, Math.max(0, Math.round(jitter(base.solarOutput, 0.06))));
  const consumption = Math.round(jitter(40 + (100 - base.rul) * 0.3, 0.08));
  const efficiency = solar > 0 ? Math.round((solar / (consumption + 1)) * 100) / 100 : 0;
  return {
    timestamp: Date.now(),
    batteryLevel: battery,
    solarOutput: solar,
    consumption,
    efficiency: Math.min(2, efficiency),
    rul: Math.min(100, Math.max(0, Math.round(jitter(base.rul, 0.05)))),
  };
}

export function generateCommunicationData(tick: number): CommunicationData {
  const base = CMAPSS_BASELINE[tick % CMAPSS_BASELINE.length];
  const signal = Math.min(100, Math.max(0, Math.round(jitter(base.signalQuality, 0.1))));
  const latency = Math.round(jitter(250 + (100 - base.signalQuality) * 10, 0.15));
  const dataRate = Math.round(jitter(base.signalQuality * 0.8, 0.1) * 10) / 10;
  const linkStatus: CommunicationData['linkStatus'] =
    signal >= 50 ? 'stable' : signal >= 30 ? 'degraded' : 'lost';
  return { timestamp: Date.now(), signalQuality: signal, latency, dataRate, linkStatus };
}
