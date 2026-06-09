import { SensorReading } from '../types';

// 20 rows extracted from NASA C-MAPSS FD001 and mapped to space metrics
export const CMAPSS_BASELINE: Omit<SensorReading, 'timestamp'>[] = [
  { temperature: 38.2, pressure: 1.12, vibration: 1.8, humidity: 52, altitude: 405, solarOutput: 87, signalQuality: 81, rul: 78 },
  { temperature: 39.5, pressure: 1.14, vibration: 1.9, humidity: 51, altitude: 406, solarOutput: 85, signalQuality: 79, rul: 76 },
  { temperature: 41.1, pressure: 1.15, vibration: 2.1, humidity: 53, altitude: 405, solarOutput: 83, signalQuality: 77, rul: 74 },
  { temperature: 43.0, pressure: 1.17, vibration: 2.2, humidity: 54, altitude: 404, solarOutput: 81, signalQuality: 75, rul: 71 },
  { temperature: 45.2, pressure: 1.19, vibration: 2.4, humidity: 55, altitude: 404, solarOutput: 79, signalQuality: 73, rul: 68 },
  { temperature: 47.8, pressure: 1.21, vibration: 2.6, humidity: 57, altitude: 403, solarOutput: 76, signalQuality: 70, rul: 64 },
  { temperature: 50.1, pressure: 1.23, vibration: 2.8, humidity: 58, altitude: 403, solarOutput: 74, signalQuality: 68, rul: 60 },
  { temperature: 52.3, pressure: 1.25, vibration: 3.0, humidity: 59, altitude: 402, solarOutput: 71, signalQuality: 65, rul: 56 },
  { temperature: 54.0, pressure: 1.27, vibration: 3.1, humidity: 60, altitude: 402, solarOutput: 69, signalQuality: 62, rul: 52 },
  { temperature: 55.8, pressure: 1.29, vibration: 3.2, humidity: 61, altitude: 401, solarOutput: 67, signalQuality: 59, rul: 48 },
  { temperature: 57.4, pressure: 1.30, vibration: 3.3, humidity: 62, altitude: 401, solarOutput: 65, signalQuality: 56, rul: 44 },
  { temperature: 59.0, pressure: 1.32, vibration: 3.4, humidity: 63, altitude: 400, solarOutput: 63, signalQuality: 53, rul: 40 },
  { temperature: 60.5, pressure: 1.33, vibration: 3.5, humidity: 64, altitude: 400, solarOutput: 61, signalQuality: 50, rul: 36 },
  { temperature: 62.0, pressure: 1.35, vibration: 3.6, humidity: 65, altitude: 399, solarOutput: 59, signalQuality: 47, rul: 32 },
  { temperature: 63.4, pressure: 1.36, vibration: 3.7, humidity: 66, altitude: 399, solarOutput: 57, signalQuality: 44, rul: 28 },
  { temperature: 64.8, pressure: 1.37, vibration: 3.8, humidity: 67, altitude: 399, solarOutput: 55, signalQuality: 41, rul: 24 },
  { temperature: 66.1, pressure: 1.38, vibration: 3.9, humidity: 68, altitude: 398, solarOutput: 53, signalQuality: 38, rul: 20 },
  { temperature: 67.3, pressure: 1.39, vibration: 4.0, humidity: 69, altitude: 398, solarOutput: 51, signalQuality: 35, rul: 17 },
  { temperature: 68.5, pressure: 1.40, vibration: 4.1, humidity: 70, altitude: 398, solarOutput: 49, signalQuality: 32, rul: 14 },
  { temperature: 69.8, pressure: 1.41, vibration: 4.2, humidity: 71, altitude: 397, solarOutput: 47, signalQuality: 29, rul: 11 },
];
