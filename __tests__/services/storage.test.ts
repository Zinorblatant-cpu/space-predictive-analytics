import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveUser,
  getUser,
  saveSettings,
  getSettings,
  saveAlerts,
  getAlerts,
} from '../../services/storage';
import { DEFAULT_SETTINGS } from '../../constants/thresholds';
import { Alert, User } from '../../types';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key: string) => {
      return Promise.resolve(store[key] ?? null);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
      return Promise.resolve();
    }),
  };
});

const mockUser: User = {
  id: 'u1',
  name: 'Leonardo',
  email: 'leo@test.com',
  rm: 'RM123456',
  passwordHash: 'hash123',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockAlert: Alert = {
  id: 'a1',
  type: 'temperature',
  message: 'Temperatura crítica',
  severity: 'critical',
  value: 70,
  threshold: 65,
  timestamp: Date.now(),
  acknowledged: false,
};

beforeEach(() => {
  (AsyncStorage.clear as jest.Mock)();
  jest.clearAllMocks();
});

describe('storage — saveUser / getUser', () => {
  it('persiste e recupera um usuário', async () => {
    await saveUser(mockUser);
    const result = await getUser(mockUser.email);
    expect(result).toEqual(mockUser);
  });

  it('retorna null para email inexistente', async () => {
    const result = await getUser('naoexiste@test.com');
    expect(result).toBeNull();
  });
});

describe('storage — saveSettings / getSettings', () => {
  it('persiste e recupera settings', async () => {
    await saveSettings(DEFAULT_SETTINGS);
    const result = await getSettings();
    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it('retorna default settings quando não há nada salvo', async () => {
    const result = await getSettings();
    expect(result).toEqual(DEFAULT_SETTINGS);
  });
});

describe('storage — saveAlerts / getAlerts', () => {
  it('persiste e recupera lista de alertas', async () => {
    await saveAlerts([mockAlert]);
    const result = await getAlerts();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockAlert);
  });

  it('retorna array vazio quando não há alertas', async () => {
    const result = await getAlerts();
    expect(result).toEqual([]);
  });
});
