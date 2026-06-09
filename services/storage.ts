import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, MissionSettings, User } from '../types';
import { DEFAULT_SETTINGS } from '../constants/thresholds';

const KEYS = {
  USER_PREFIX: '@spa:user:',
  SESSION: '@spa:session',
  SETTINGS: '@spa:settings',
  ALERTS: '@spa:alerts',
} as const;

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PREFIX + user.email, JSON.stringify(user));
}

export async function getUser(email: string): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER_PREFIX + email);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function saveSession(email: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.SESSION, email);
}

export async function getSession(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.SESSION);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.SESSION);
}

export async function saveSettings(settings: MissionSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getSettings(): Promise<MissionSettings> {
  const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
  return raw ? (JSON.parse(raw) as MissionSettings) : DEFAULT_SETTINGS;
}

export async function saveAlerts(alerts: Alert[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.ALERTS, JSON.stringify(alerts));
}

export async function getAlerts(): Promise<Alert[]> {
  const raw = await AsyncStorage.getItem(KEYS.ALERTS);
  return raw ? (JSON.parse(raw) as Alert[]) : [];
}
