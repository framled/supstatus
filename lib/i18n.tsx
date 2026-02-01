"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

export const translations = {
    es: {
        header: {
            subtitle: "Pronóstico y Condiciones Costeras",
        },
        dashboard: {
            forecastFor: "Pronóstico para",
            loading: "Cargando pronóstico...",
            error: "Error al cargar datos",
            selectLocation: "Selecciona una ubicación para ver condiciones",
            noData: "No hay datos disponibles para esta fecha.",
        },
        session: {
            early: "Sesión Temprana",
            morning: "Pico Matutino",
            mid: "Surf de Mediodía",
            afternoon: "Tarde Onshore",
            golden: "Hora Dorada",
            night: "Anochecer",
            wind: "Viento",
            swell: "Oleaje",
            water: "Agua",
            conditions: {
                junior: "Condiciones aptas para principiantes y remadores sin experiencia.",
                intermediate: "Condiciones moderadas. Apto para quienes tienen algo de experiencia.",
                senior: "Condiciones desafiantes. Recomendado solo para expertos.",
            }
        },
        sunTide: {
            sunrise: "Amanecer",
            sunset: "Atardecer",
            lowTide: "Marea Baja",
        },
        safety: {
            title: "Seguridad Primero",
            message: "Las condiciones en Chile Central pueden cambiar rápidamente. Consulta siempre a las autoridades locales y nunca remes solo con viento offshore.",
            vest: "Usa chaleco salvavidas (PFD) en todo momento.",
        },
        days: {
            today: "Hoy",
            tomorrow: "Mañana",
            now: "Ahora",
        },
        suitability: {
            junior: "Principiante",
            intermediate: "Intermedio",
            senior: "Avanzado"
        }
    },
    en: {
        header: {
            subtitle: "Coastal Weather & Conditions Dashboard",
        },
        dashboard: {
            forecastFor: "Forecast for",
            loading: "Loading forecast...",
            error: "Failed to load weather data",
            selectLocation: "Select a location to check conditions",
            noData: "No forecast data available for this date.",
        },
        session: {
            early: "Early Session",
            morning: "Morning Peak",
            mid: "Mid-Day Surf",
            afternoon: "Afternoon Onshore",
            golden: "Golden Hour",
            night: "Nightfall",
            wind: "Wind",
            swell: "Swell",
            water: "Water",
            conditions: {
                junior: "Conditions suitable for beginners and non-experienced paddlers",
                intermediate: "Moderate conditions. Suitable for those with some experience",
                senior: "Challenging conditions. Recommended for expert paddlers only.",
            }
        },
        sunTide: {
            sunrise: "Sunrise",
            sunset: "Sunset",
            lowTide: "Low Tide",
        },
        safety: {
            title: "Safety First",
            message: "Conditions in Central Chile can change rapidly. Always check local authorities and never paddle alone in offshore winds.",
            vest: "Wear a safety vest (PFD) at all times.",
        },
        days: {
            today: "Today",
            tomorrow: "Tomorrow",
            now: "Now",
        },
        suitability: {
            junior: "Junior",
            intermediate: "Intermediate",
            senior: "Senior"
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.es;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('es');

    const value = {
        language,
        setLanguage,
        t: translations[language]
    };

    return (
        <LanguageContext.Provider value= { value } >
        { children }
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
