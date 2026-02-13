export type WeatherData = {
  temperature: number;
  weatherCode: number;
};

const NISHI_WASEDA = { latitude: 35.7081, longitude: 139.7095 };

export async function fetchNishiWasedaWeather(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${NISHI_WASEDA.latitude}&longitude=${NISHI_WASEDA.longitude}&current=temperature_2m,weather_code`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Unable to load weather');
  }

  const payload = await response.json();
  return {
    temperature: Math.round(payload.current.temperature_2m),
    weatherCode: payload.current.weather_code,
  };
}

export function weatherEmoji(code: number) {
  if (code <= 1) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌈';
}
