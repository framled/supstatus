
import { WeatherCondition, SuitabilityLevel, SuitabilityResult } from './types';

export function checkSuitability(
    conditions: WeatherCondition,
    userLevel: SuitabilityLevel
): SuitabilityResult {
    const { windSpeed, waveHeight } = conditions;

    // Limits
    const juniorLimits = { wind: 12, wave: 1.0 };
    const intermediateLimits = { wind: 20, wave: 2.0 };

    if (userLevel === 'Junior') {
        if (windSpeed <= juniorLimits.wind && waveHeight <= juniorLimits.wave) {
            return { level: 'Junior', isSuitable: true, message: 'Conditions are perfect for you!', color: 'green' };
        }
        return { level: 'Junior', isSuitable: false, message: 'Too rough for juniors.', color: 'red' };
    }

    if (userLevel === 'Intermediate') {
        if (windSpeed <= intermediateLimits.wind && waveHeight <= intermediateLimits.wave) {
            return { level: 'Intermediate', isSuitable: true, message: 'Great conditions.', color: 'green' };
        }
        return { level: 'Intermediate', isSuitable: false, message: 'Conditions difficult.', color: 'red' };
    }

    // Senior
    if (windSpeed > 35 || waveHeight > 4.0) {
        return { level: 'Senior', isSuitable: false, message: 'Extreme conditions! Danger.', color: 'red' };
    }
    return { level: 'Senior', isSuitable: true, message: 'Go for it!', color: 'green' };
}
