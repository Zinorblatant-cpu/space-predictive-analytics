export interface User {
  id: string;
  name: string;
  email: string;
  rm: string;
  passwordHash: string;
  createdAt: string;
}

export interface SensorReading {
  timestamp: number;
  temperature: number;
  pressure: number;
  vibration: number;
  humidity: number;
  altitude: number;
  solarOutput: number;
  signalQuality: number;
  rul: number;
}

export interface EnergyData {
  timestamp: number;
  batteryLevel: number;
  solarOutput: number;
  consumption: number;
  efficiency: number;
  rul: number;
}

export interface CommunicationData {
  timestamp: number;
  signalQuality: number;
  latency: number;
  dataRate: number;
  linkStatus: 'stable' | 'degraded' | 'lost';
}

export interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export type AlertSeverity = 'critical' | 'warning';

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  value: number;
  threshold: number;
  timestamp: number;
  acknowledged: boolean;
}

export interface AlertThresholds {
  temperatureMax: number;
  pressureMax: number;
  vibrationMax: number;
  batteryMin: number;
  signalMin: number;
  rulMin: number;
}

export interface MissionSettings {
  missionName: string;
  refreshInterval: number;
  notificationsEnabled: boolean;
  thresholds: AlertThresholds;
}

export interface MissionData {
  currentSensor: SensorReading;
  sensorHistory: SensorReading[];
  energyHistory: EnergyData[];
  communicationHistory: CommunicationData[];
  issPosition: ISSPosition | null;
  settings: MissionSettings;
}
