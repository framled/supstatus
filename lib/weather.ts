
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
        const [wRes, mRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=sea_level_height_msl&daily=sunrise,sunset&timezone=auto`)
        ]);

        const wData = await wRes.json();
        const mData = await mRes.json();

        // Simulate variation based on day offset
        // Day 1: +2kn, Day 2: -3kn, Day 3: +5kn, etc. (Pseudo-random deterministic)
        const windVariation = [0, 2, -1.5, 4, 6, -2, 3.5][dayOffset % 7] || 0;
        const waveVariation = [0, 0.2, -0.1, 0.4, 0.6, -0.2, 0.3][dayOffset % 7] || 0;

        const baseWind = wData.current.wind_speed_10m;
        const simulatedWind = Math.max(2, parseFloat((baseWind + windVariation).toFixed(1))); // Min 2kn

        // Mock wave height based on wind + variation
        const mockWave = (simulatedWind * 0.06) + (Math.random() * 0.3) + waveVariation;

        // Process Sun Data (Daily)
        // Find index for the requested date
        // Open-Meteo returns daily arrays. match date.
        const reqDateStr = date.toISOString().split('T')[0];
        const dailyIndex = mData.daily?.time?.findIndex((t: string) => t === reqDateStr) ?? 0;

        const sunrise = mData.daily?.sunrise?.[dailyIndex] || "06:00";
        const sunset = mData.daily?.sunset?.[dailyIndex] || "20:00";

        // Process Tide Data (Hourly Sea Level) to find Low Tide
        // Find the lowest elevation between 6AM and 9PM for the day (surfer daylight hours)
        let lowTideTime = "10:00";
        let minElevation = 999;

        if (mData.hourly?.sea_level_height_msl && mData.hourly?.time) {
            const elevations = mData.hourly.sea_level_height_msl;
            const times = mData.hourly.time;

            for (let i = 0; i < times.length; i++) {
                const t = times[i];
                if (t.startsWith(reqDateStr)) {
                    // Check if daylight hours roughly (06 to 21)
                    const hour = parseInt(t.split('T')[1].split(':')[0]);
                    if (hour >= 6 && hour <= 21) {
                        if (elevations[i] < minElevation) {
                            minElevation = elevations[i];
                            lowTideTime = t;
                        }
                    }
                }
            }
        }

        return {
            time: date.toISOString(), // Return the requested date
            temperature: wData.current.temperature_2m + (dayOffset % 2 === 0 ? 1 : -1),
            windSpeed: simulatedWind,
            waveHeight: Math.max(0.2, parseFloat(mockWave.toFixed(1))), // Min 0.2m
            conditionCode: 0, // placeholder
            sunrise,
            sunset,
            lowTideTime
        };
    } catch (e) {
        console.error("Failed to fetch weather", e);
        // Fallback mock
        return {
            time: date.toISOString(),
            temperature: 15,
            windSpeed: 10 + dayOffset,
            waveHeight: 0.8 + (dayOffset * 0.1),
            conditionCode: 0,
            sunrise: "07:00",
            sunset: "20:00",
            lowTideTime: "11:00"
        };
    }
}
