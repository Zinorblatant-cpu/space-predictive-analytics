import { evaluateAlerts } from '../../services/alertEngine';
import { DEFAULT_THRESHOLDS } from '../../constants/thresholds';
import { SensorReading } from '../../types';

const baseSensor: SensorReading = {
  timestamp: Date.now(),
  temperature: 40,
  pressure: 1.2,
  vibration: 2.0,
  humidity: 55,
  altitude: 405,
  solarOutput: 80,
  signalQuality: 70,
  rul: 60,
};

describe('alertEngine — evaluateAlerts', () => {
  it('não gera alertas quando tudo está normal', () => {
    const alerts = evaluateAlerts(baseSensor, DEFAULT_THRESHOLDS);
    expect(alerts).toHaveLength(0);
  });

  it('gera alerta crítico quando temperatura excede o limiar', () => {
    const sensor = { ...baseSensor, temperature: 70 };
    const alerts = evaluateAlerts(sensor, DEFAULT_THRESHOLDS);
    const tempAlert = alerts.find((a) => a.type === 'temperature');
    expect(tempAlert).toBeDefined();
    expect(tempAlert?.severity).toBe('critical');
    expect(tempAlert?.value).toBe(70);
  });

  it('gera alerta quando bateria está baixa (solarOutput abaixo do mínimo)', () => {
    const sensor = { ...baseSensor, solarOutput: 15 };
    const alerts = evaluateAlerts(sensor, DEFAULT_THRESHOLDS);
    const energyAlert = alerts.find((a) => a.type === 'solarOutput');
    expect(energyAlert).toBeDefined();
  });

  it('gera alerta quando qualidade do sinal está baixa', () => {
    const sensor = { ...baseSensor, signalQuality: 20 };
    const alerts = evaluateAlerts(sensor, DEFAULT_THRESHOLDS);
    const signalAlert = alerts.find((a) => a.type === 'signalQuality');
    expect(signalAlert).toBeDefined();
  });

  it('todos os alertas têm id único', () => {
    const sensor = { ...baseSensor, temperature: 70, signalQuality: 20, rul: 10 };
    const alerts = evaluateAlerts(sensor, DEFAULT_THRESHOLDS);
    const ids = alerts.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('alerta inclui valor e limiar para comparação', () => {
    const sensor = { ...baseSensor, temperature: 70 };
    const alerts = evaluateAlerts(sensor, DEFAULT_THRESHOLDS);
    const tempAlert = alerts.find((a) => a.type === 'temperature');
    expect(tempAlert?.value).toBe(70);
    expect(tempAlert?.threshold).toBe(DEFAULT_THRESHOLDS.temperatureMax);
  });
});
