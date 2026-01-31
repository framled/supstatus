"use client";

import { useEffect, useState } from "react";
import { Location, WeatherCondition } from "@/lib/types";
import { fetchWeather } from "@/lib/weather";
import { determineRequiredLevel } from "@/lib/suitability";
import { SuitabilityBadge } from "./SuitabilityBadge";
import { SafetyWarning } from "./SafetyWarning";
import { SunTideBar } from "./SunTideBar";
import { DaySelector } from "./DaySelector";
import { Calendar } from "lucide-react";
import clsx from "clsx";

const SESSIONS = [
    { id: "early", label: "Early Session", time: "06:00" },
    { id: "morning", label: "Morning Peak", time: "09:00" },
    { id: "mid", label: "Mid-Day Surf", time: "12:00" },
    { id: "afternoon", label: "Afternoon Onshore", time: "15:00" },
    { id: "golden", label: "Golden Hour", time: "18:00" },
    { id: "night", label: "Nightfall", time: "21:00" },
];

export function WeatherDashboard({ location }: { location: Location | null }) {
    const [weather, setWeather] = useState<WeatherCondition | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (location) {
            setLoading(true);
            fetchWeather(location.lat, location.lon, selectedDate)
                .then(setWeather)
                .finally(() => setLoading(false));
        }
    }, [location, selectedDate]);

    if (!location) {
        return <div className="text-center text-cream/60 mt-20 text-lg">Select a location to check conditions</div>;
    }

    if (loading || !weather) {
        return <div className="text-center text-white mt-20 animate-pulse">Updating forecast...</div>;
    }

    // Generate session cards based on current weather
    const sessionCards = SESSIONS.map((session, idx) => {
        // Mock variation: wind increases in afternoon
        const windMod = idx === 3 ? 1.5 : idx === 4 ? 0.8 : 1.0;
        const waveMod = 1.0;

        const sessionConditions = {
            ...weather,
            windSpeed: parseFloat((weather.windSpeed * windMod).toFixed(1)),
            waveHeight: parseFloat((weather.waveHeight * waveMod).toFixed(1)),
        };

        const level = determineRequiredLevel(sessionConditions);

        return {
            ...session,
            conditions: sessionConditions,
            level
        };
    });

    return (
        <div className="w-full mt-6">
            <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />

            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-cream/70 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Forecast for</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white drop-shadow-sm">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                </div>
            </div>

            {/* Session Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionCards.map((card) => (
                    <div key={card.id} className="glass-card p-5 rounded-lg flex flex-col gap-3 group">
                        <div className="flex justify-between items-start">
                            <span className="text-white font-semibold text-lg">{card.label}</span>
                            <SuitabilityBadge level={card.level} />
                        </div>

                        <div className="h-px bg-white/10 w-full my-1" />

                        <div className="flex justify-between items-center text-cream/90 text-sm">
                            <div className="flex flex-col">
                                <span className="text-xs text-cream/50 uppercase">Wind</span>
                                <span className="font-mono text-lg font-medium">{card.conditions.windSpeed} kn</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-cream/50 uppercase">Waves</span>
                                <span className="font-mono text-lg font-medium">{card.conditions.waveHeight} m</span>
                            </div>
                        </div>

                        <p className="text-xs mt-1 text-cream/60 italic">
                            Minimum required level
                        </p>
                    </div>
                ))}
            </div>

            {/* Info Bar */}
            <SunTideBar />

            {/* Warning */}
            <SafetyWarning />
        </div>
    );
}
