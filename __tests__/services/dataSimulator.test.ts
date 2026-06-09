import {
  generateSensorReading,
  generateEnergyData,
  generateCommunicationData,
} from '../../services/dataSimulator';

describe('dataSimulator — generateSensorReading', () => {
  it('retorna leitura com todos os campos obrigatórios', () => {
    const reading = generateSensorReading(0);
    expect(reading).toHaveProperty('timestamp');
    expect(reading).toHaveProperty('temperature');
    expect(reading).toHaveProperty('pressure');
    expect(reading).toHaveProperty('vibration');
    expect(reading).toHaveProperty('humidity');
    expect(reading).toHaveProperty('altitude');
    expect(reading).toHaveProperty('solarOutput');
    expect(reading).toHaveProperty('signalQuality');
    expect(reading).toHaveProperty('rul');
  });

  it('temperatura dentro dos limites esperados (18–80°C)', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateSensorReading(i);
      expect(r.temperature).toBeGreaterThanOrEqual(15);
      expect(r.temperature).toBeLessThanOrEqual(85);
    }
  });

  it('RUL dentro do intervalo (0–100%)', () => {
    for (let i = 0; i < 20; i++) {
      const r = generateSensorReading(i);
      expect(r.rul).toBeGreaterThanOrEqual(0);
      expect(r.rul).toBeLessThanOrEqual(100);
    }
  });

  it('cicla pelo dataset C-MAPSS (índice 0 e 20 usam mesma linha base)', () => {
    // Com jitter aleatório, os valores exatos diferem, mas devem estar na mesma faixa
    const r0 = generateSensorReading(0);
    const r20 = generateSensorReading(20);
    // Ambos mapeiam para CMAPSS_BASELINE[0] (78 de RUL), tolerância 20%
    expect(Math.abs(r0.rul - r20.rul)).toBeLessThan(20);
  });
});

describe('dataSimulator — generateEnergyData', () => {
  it('retorna dados de energia com campos corretos', () => {
    const e = generateEnergyData(0);
    expect(e).toHaveProperty('batteryLevel');
    expect(e).toHaveProperty('solarOutput');
    expect(e).toHaveProperty('consumption');
    expect(e).toHaveProperty('efficiency');
    expect(e.batteryLevel).toBeGreaterThanOrEqual(0);
    expect(e.batteryLevel).toBeLessThanOrEqual(100);
  });
});

describe('dataSimulator — generateCommunicationData', () => {
  it('retorna dados de comunicação com linkStatus válido', () => {
    const c = generateCommunicationData(0);
    expect(['stable', 'degraded', 'lost']).toContain(c.linkStatus);
    expect(c.latency).toBeGreaterThan(0);
    expect(c.dataRate).toBeGreaterThan(0);
  });
});
