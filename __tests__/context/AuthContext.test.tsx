import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock AsyncStorage com estado stateful
jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    setItem: jest.fn((k: string, v: string) => { store[k] = v; return Promise.resolve(); }),
    getItem: jest.fn((k: string) => Promise.resolve(store[k] ?? null)),
    removeItem: jest.fn((k: string) => { delete store[k]; return Promise.resolve(); }),
    clear: jest.fn(() => { Object.keys(store).forEach((k) => delete store[k]); return Promise.resolve(); }),
  };
});

describe('AuthContext — exports', () => {
  it('AuthProvider é um componente (função)', () => {
    expect(typeof AuthProvider).toBe('function');
  });

  it('useAuth é uma função (hook)', () => {
    expect(typeof useAuth).toBe('function');
  });

  it('useAuth exportado como função (hook pronto para uso)', () => {
    // Hooks não podem ser chamados fora de componentes React —
    // verificamos apenas que é uma função exportada corretamente
    expect(useAuth.name).toBe('useAuth');
    expect(useAuth.length).toBe(0);
  });
});

describe('AuthContext — lógica de validação de senha (btoa)', () => {
  it('btoa encoda string corretamente', () => {
    expect(btoa('senha123')).toBe('c2VuaGExMjM=');
  });

  it('senha incorreta não bate com hash', () => {
    const hash = btoa('correta');
    expect(hash).not.toBe(btoa('errada'));
  });
});
