
import { WeatherCondition, SuitabilityLevel } from './types';

export function determineRequiredLevel(conditions: WeatherCondition): SuitabilityLevel {
    const { windSpeed, waveHeight } = conditions;
    // Junior Thresholds (Flatwater / Beginner)
    if (windSpeed <= 8 && waveHeight <= 1.5) {
        return 'Junior';
    }

    // Intermediate Thresholds (Breeze / Small Chop)
    if (windSpeed <= 15 && waveHeight <= 2) {
        return 'Intermediate';
    }

    // Senior (Advanced conditions)
    return 'Senior';
}
