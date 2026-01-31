
export interface WeatherCondition {
    time: string;
    windSpeed: number; // knots
    waveHeight: number; // meters
    temperature: number; // celsius
    conditionCode: number; // WMO code
}

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
