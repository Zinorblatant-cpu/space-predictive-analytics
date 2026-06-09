import { AlertThresholds } from '../types';

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  temperatureMax: 65,
  pressureMax: 1.4,
  vibrationMax: 3.5,
  batteryMin: 20,
  signalMin: 30,
  rulMin: 20,
};

export const DEFAULT_SETTINGS = {
  missionName: 'Missão Orbital Alpha',
  refreshInterval: 5,
  notificationsEnabled: true,
  thresholds: DEFAULT_THRESHOLDS,
};
