"use client";

import { useEffect, useState } from "react";
import { Location, SuitabilityLevel, WeatherCondition } from "@/lib/types";
import { fetchWeather } from "@/lib/weather";
import { checkSuitability } from "@/lib/suitability";
import { SuitabilityBadge } from "./SuitabilityBadge";
import { SafetyWarning } from "./SafetyWarning";
import { SunTideBar } from "./SunTideBar";
import { User, Calendar } from "lucide-react";
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
    const [level, setLevel] = useState<SuitabilityLevel>("Junior");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location) {
            setLoading(true);
            fetchWeather(location.lat, location.lon)
                .then(setWeather)
                .finally(() => setLoading(false));
        }
    }, [location]);

    if (!location) {
        return <div className="text-center text-white/60 mt-20 text-lg">Select a location to check conditions</div>;
    }

    if (loading || !weather) {
        return <div className="text-center text-white mt-20 animate-pulse">Updating forecast...</div>;
    }

    // Generate session cards based on current weather (mocking variation for now)
    const sessionCards = SESSIONS.map((session, idx) => {
        // Mock variation: wind increases in afternoon
        const windMod = idx === 3 ? 1.5 : idx === 4 ? 0.8 : 1.0;
        const waveMod = 1.0;

        const sessionConditions = {
            ...weather,
            windSpeed: parseFloat((weather.windSpeed * windMod).toFixed(1)),
            waveHeight: parseFloat((weather.waveHeight * waveMod).toFixed(1)),
        };

        const suitability = checkSuitability(sessionConditions, level);

        return {
            ...session,
            conditions: sessionConditions,
            suitability
        };
    });

    return (
        <div className="w-full mt-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Today's Forecast</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                </div>

                {/* Level Switcher */}
                <div className="bg-white/10 p-1 rounded-lg flex items-center backdrop-blur-md border border-white/10">
                    {(['Junior', 'Intermediate', 'Senior'] as SuitabilityLevel[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLevel(l)}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                level === l ? "bg-primary text-white shadow-sm" : "text-white/60 hover:text-white"
                            )}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* Session Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionCards.map((card) => (
                    <div key={card.id} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-5 rounded-2xl flex flex-col gap-3 group">
                        <div className="flex justify-between items-start">
                            <span className="text-white font-semibold text-lg">{card.label}</span>
                            <SuitabilityBadge result={card.suitability} />
                        </div>

                        <div className="h-px bg-white/5 w-full my-1" />

                        <div className="flex justify-between items-center text-white/80 text-sm">
                            <div className="flex flex-col">
                                <span className="text-xs opacity-50 uppercase">Wind</span>
                                <span className="font-mono text-lg">{card.conditions.windSpeed} kn</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs opacity-50 uppercase">Waves</span>
                                <span className="font-mono text-lg">{card.conditions.waveHeight} m</span>
                            </div>
                        </div>

                        <p className={clsx("text-xs mt-1",
                            card.suitability.isSuitable ? "text-green-200/70" : "text-red-200/70"
                        )}>
                            {card.suitability.message}
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
