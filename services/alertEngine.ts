import { Alert, AlertSeverity, AlertThresholds, SensorReading } from '../types';

function makeAlert(
  type: string,
  message: string,
  value: number,
  threshold: number,
  severity: AlertSeverity
): Alert {
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    severity,
    value,
    threshold,
    timestamp: Date.now(),
    acknowledged: false,
  };
}

export function evaluateAlerts(
  sensor: SensorReading,
  thresholds: AlertThresholds
): Alert[] {
  const alerts: Alert[] = [];

  if (sensor.temperature > thresholds.temperatureMax) {
    alerts.push(makeAlert(
      'temperature',
      `Temperatura crítica: ${sensor.temperature.toFixed(1)}°C`,
      sensor.temperature,
      thresholds.temperatureMax,
      'critical'
    ));
  }

  if (sensor.pressure > thresholds.pressureMax) {
    alerts.push(makeAlert(
      'pressure',
      `Pressão elevada: ${sensor.pressure.toFixed(2)} atm`,
      sensor.pressure,
      thresholds.pressureMax,
      'warning'
    ));
  }

  if (sensor.vibration > thresholds.vibrationMax) {
    alerts.push(makeAlert(
      'vibration',
      `Vibração excessiva: ${sensor.vibration.toFixed(2)} m/s²`,
      sensor.vibration,
      thresholds.vibrationMax,
      'critical'
    ));
  }

  if (sensor.solarOutput < thresholds.batteryMin) {
    alerts.push(makeAlert(
      'solarOutput',
      `Energia solar baixa: ${sensor.solarOutput}%`,
      sensor.solarOutput,
      thresholds.batteryMin,
      sensor.solarOutput < thresholds.batteryMin / 2 ? 'critical' : 'warning'
    ));
  }

  if (sensor.signalQuality < thresholds.signalMin) {
    alerts.push(makeAlert(
      'signalQuality',
      `Sinal fraco: ${sensor.signalQuality}%`,
      sensor.signalQuality,
      thresholds.signalMin,
      sensor.signalQuality < thresholds.signalMin / 2 ? 'critical' : 'warning'
    ));
  }

  if (sensor.rul < thresholds.rulMin) {
    alerts.push(makeAlert(
      'rul',
      `Vida útil residual crítica: ${sensor.rul}%`,
      sensor.rul,
      thresholds.rulMin,
      'critical'
    ));
  }

  return alerts;
}
