"use client";

import { useEffect, useState } from "react";
import { Location, ForecastData } from "@/lib/types";
import { fetchWeather } from "@/lib/weather";
import { determineRequiredLevel } from "@/lib/suitability";
import { SuitabilityBadge } from "./SuitabilityBadge";
import { SafetyWarning } from "./SafetyWarning";
import { SunTideBar } from "./SunTideBar";
import { DaySelector } from "./DaySelector";
import { SessionCard } from "./SessionCard";
import { WeatherError } from "./WeatherError";
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
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const loadWeather = () => {
        if (!location) return;

        setLoading(true);
        setError(null);

        fetchWeather(location.lat, location.lon)
            .then(setForecast)
            .catch((err) => {
                console.error(err);
                setError(err.message || "Failed to load weather data");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadWeather();
    }, [location]);

    if (!location) {
        return <div className="text-center text-cream/60 mt-20 text-lg">Select a location to check conditions</div>;
    }

    if (error) {
        return <WeatherError message={error} onRetry={loadWeather} />;
    }

    if (!forecast && loading) {
        return <div className="text-center text-white mt-20 animate-pulse">Loading forecast...</div>;
    }

    if (!forecast) return null;

    // Get Data for Selected Date
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dailyData = forecast[dateStr];

    if (!dailyData) {
        return <div className="text-center text-cream/60 mt-20">No forecast data available for this date.</div>;
    }

    // Generate session cards based on REAL hourly data
    const sessionCards = SESSIONS.map((session) => {
        const targetHour = parseInt(session.time.split(':')[0]);

        // Find closest hourly data
        const hourlyCondition = dailyData.hourly.find((h) => {
            const hTime = new Date(h.time);
            return hTime.getHours() === targetHour;
        }) || dailyData.hourly[0];

        const conditions = {
            windSpeed: hourlyCondition?.windSpeed ?? 0,
            waveHeight: hourlyCondition?.waveHeight ?? 0,
            temperature: hourlyCondition?.temperature ?? 0,
        };

        const level = determineRequiredLevel(conditions as any);

        return {
            ...session,
            conditions,
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
                    <SessionCard
                        key={card.id}
                        label={card.label}
                        time={card.time}
                        conditions={card.conditions}
                        level={card.level}
                        loading={loading}
                    />
                ))}
            </div>

            {/* Info Bar */}
            <SunTideBar
                sunrise={dailyData.sunrise}
                sunset={dailyData.sunset}
                lowTide={dailyData.lowTideTime}
                loading={loading}
            />

            {/* Warning */}
            <SafetyWarning />
        </div>
    );
}
