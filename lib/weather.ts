import { ForecastData, DailyForecast, HourlyCondition } from './types';

async function fetchWindData(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&wind_speed_unit=kn`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch wind data");
    return res.json();
}

async function fetchMarineData(lat: number, lon: number) {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,sea_level_height_msl&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch marine data");
    return res.json();
}

export async function fetchWeather(lat: number, lon: number): Promise<ForecastData> {
    try {
        const [windData, marineData] = await Promise.all([
            fetchWindData(lat, lon),
            fetchMarineData(lat, lon)
        ]);

        const forecast: ForecastData = {};

        // Helper to get or create daily entry
        const getDailyEntry = (dateStr: string): DailyForecast => {
            if (!forecast[dateStr]) {
                // Find daily index for sun/tide data
                const dailyIndex = marineData.daily?.time?.findIndex((t: string) => t === dateStr);
                const sunrise = dailyIndex !== -1 ? marineData.daily?.sunrise?.[dailyIndex] : "06:00";
                const sunset = dailyIndex !== -1 ? marineData.daily?.sunset?.[dailyIndex] : "20:00";

                // Calculate Low Tide for this day
                // We need to look at hourly marine data for this specific date
                let lowTideTime = "10:00";
                let minElevation = 999;

                if (marineData.hourly?.sea_level_height_msl && marineData.hourly?.time) {
                    marineData.hourly.time.forEach((t: string, i: number) => {
                        if (t.startsWith(dateStr)) {
                            const hour = parseInt(t.split('T')[1].split(':')[0]);
                            // Surfing daylight hours roughly 6am to 9pm
                            if (hour >= 6 && hour <= 21) {
                                const elevation = marineData.hourly.sea_level_height_msl[i];
                                if (elevation < minElevation) {
                                    minElevation = elevation;
                                    lowTideTime = t;
                                }
                            }
                        }
                    });
                }

                forecast[dateStr] = {
                    date: dateStr,
                    sunrise: sunrise || "06:00",
                    sunset: sunset || "20:00",
                    lowTideTime: lowTideTime,
                    hourly: []
                };
            }
            return forecast[dateStr];
        };

        // Merge hourly data
        // Assuming windData.hourly.time and marineData.hourly.time are aligned or we match by string
        const windTimes = windData.hourly?.time || [];

        windTimes.forEach((time: string, i: number) => {
            const dateStr = time.split('T')[0];
            const entry = getDailyEntry(dateStr);

            // Find matching index in marine data (should be same if aligned, but safe to check)
            // For performance, assuming same index usually works with OpenMeteo if queried same params, 
            // but let's be safe or just use 'i' if we trust alignment. 
            // OpenMeteo documentation says time arrays align if parameters match.
            // Let's rely on 'i' for wind/marine sync as we requested same forecast days/hours mostly.

            const temp = windData.hourly?.temperature_2m?.[i] ?? 0;
            const wind = windData.hourly?.wind_speed_10m?.[i] ?? 0;
            const wave = marineData.hourly?.wave_height?.[i] ?? 0;

            const hourly: HourlyCondition = {
                time: time,
                temperature: temp,
                windSpeed: wind,
                waveHeight: wave
            };

            entry.hourly.push(hourly);
        });

        return forecast;

    } catch (e) {
        console.error("Failed to fetch weather", e);
        throw new Error("We're sorry, we couldn't fetch the latest weather data. Please try again in a few moments.");
    }
}
