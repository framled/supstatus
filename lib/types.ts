
export interface WeatherCondition {
    time: string;
    windSpeed: number; // knots
    waveHeight: number; // meters
    temperature: number; // celsius
    conditionCode: number; // WMO code
    sunrise: string; // ISO time
    sunset: string; // ISO time
    lowTideTime: string; // ISO time
}

export interface HourlyCondition {
    time: string; // ISO string
    temperature: number;
    windSpeed: number;
    waveHeight: number;
}

export interface DailyForecast {
    date: string; // YYYY-MM-DD
    sunrise: string;
    sunset: string;
    lowTideTime: string;
    hourly: HourlyCondition[];
}

export type ForecastData = Record<string, DailyForecast>;

export interface Location {
    id: string;
    name: string;
    lat: number;
    lon: number;
}

export type SuitabilityLevel = 'Junior' | 'Intermediate' | 'Senior';

export interface SuitabilityResult {
    level: SuitabilityLevel;
    isSuitable: boolean;
    message: string;
    color: 'green' | 'yellow' | 'red';
}
