import { ISSPosition } from '../types';

const ISS_URL = 'http://api.open-notify.org/iss-now.json';

export async function fetchISSPosition(): Promise<ISSPosition | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(ISS_URL, { signal: controller.signal });
    if (!res.ok) return null;
    const data = await res.json() as {
      iss_position: { latitude: string; longitude: string };
      timestamp: number;
    };
    return {
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp * 1000,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
