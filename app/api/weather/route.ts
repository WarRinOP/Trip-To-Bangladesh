// SERVER ONLY — Weather API Route
// Fetches current weather for all 6 Bangladesh destinations from Open-Meteo
// Free API, no key required. Cached 1 hour server-side.

import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/lib/destinations';

// WMO weather code → emoji mapping
const WEATHER_ICONS: Record<number, string> = {
  0: '☀️',
  1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  66: '🌧️', 67: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '🌨️',
  80: '🌦️', 81: '🌦️', 82: '🌦️',
  85: '🌨️', 86: '🌨️',
  95: '⛈️',
  96: '⛈️', 99: '⛈️',
};

function getWeatherIcon(code: number): string {
  return WEATHER_ICONS[code] ?? '🌡️';
}

interface WeatherResult {
  temp: number;
  icon: string;
  code: number;
}

async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherResult | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const temp = Math.round(data?.current?.temperature_2m ?? 0);
    const code = data?.current?.weathercode ?? 0;
    return { temp, icon: getWeatherIcon(code), code };
  } catch {
    return null;
  }
}

export async function GET() {
  // Fetch all 6 destinations in parallel
  const results = await Promise.all(
    DESTINATIONS.map(async (dest) => {
      const [lon, lat] = dest.coordinates;
      const weather = await fetchWeather(lat, lon);
      return { slug: dest.slug, weather };
    })
  );

  const weatherMap: Record<string, WeatherResult | null> = {};
  for (const { slug, weather } of results) {
    weatherMap[slug] = weather;
  }

  return NextResponse.json(weatherMap, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
