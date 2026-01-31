
import { WeatherCondition } from './types';

export async function fetchWeather(lat: number, lon: number, date: Date = new Date()): Promise<WeatherCondition> {
    // Calculate day offset to simulate variation for future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const dayOffset = Math.max(0, Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Fetch base weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&wind_speed_unit=kn`;

    try {
        const wRes = await fetch(weatherUrl);
        const wData = await wRes.json();

        // Simulate variation based on day offset
        // Day 1: +2kn, Day 2: -3kn, Day 3: +5kn, etc. (Pseudo-random deterministic)
        const windVariation = [0, 2, -1.5, 4, 6, -2, 3.5][dayOffset % 7] || 0;
        const waveVariation = [0, 0.2, -0.1, 0.4, 0.6, -0.2, 0.3][dayOffset % 7] || 0;

        const baseWind = wData.current.wind_speed_10m;
        const simulatedWind = Math.max(2, parseFloat((baseWind + windVariation).toFixed(1))); // Min 2kn

        // Mock wave height based on wind + variation
        const mockWave = (simulatedWind * 0.06) + (Math.random() * 0.3) + waveVariation;

        return {
            time: date.toISOString(), // Return the requested date
            temperature: wData.current.temperature_2m + (dayOffset % 2 === 0 ? 1 : -1),
            windSpeed: simulatedWind,
            waveHeight: Math.max(0.2, parseFloat(mockWave.toFixed(1))), // Min 0.2m
            conditionCode: 0 // placeholder
        };
    } catch (e) {
        console.error("Failed to fetch weather", e);
        // Fallback mock
        return {
            time: date.toISOString(),
            temperature: 15,
            windSpeed: 10 + dayOffset,
            waveHeight: 0.8 + (dayOffset * 0.1),
            conditionCode: 0
        };
    }
}
