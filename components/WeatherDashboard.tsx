"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Location, ForecastData } from "@/lib/types";
import { fetchWeather } from "@/lib/weather";
import { determineRequiredLevel } from "@/lib/suitability";
import { SafetyWarning } from "./SafetyWarning";
import { SunTideBar } from "./SunTideBar";
import { DaySelector } from "./DaySelector";
import { SessionCard } from "./SessionCard";
import { WeatherError } from "./WeatherError";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";
import { LocationCard } from "./LocationCard";
import { Header } from "./Header";

const OpenMap = dynamic(() => import("./OpenMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-deep-indigo animate-pulse" />
});

const SESSIONS = [
    { id: "early", label: "Early Session", time: "06:00" },
    { id: "morning", label: "Morning Peak", time: "09:00" },
    { id: "mid", label: "Mid-Day Surf", time: "12:00" },
    { id: "afternoon", label: "Afternoon Onshore", time: "15:00" },
    { id: "golden", label: "Golden Hour", time: "18:00" },
    { id: "night", label: "Nightfall", time: "21:00" },
] as const;

interface WeatherDashboardProps {
    location: Location | null;
    onLocationSelect: (location: Location) => void;
}

export function WeatherDashboard({ location, onLocationSelect }: WeatherDashboardProps) {
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { t, language } = useLanguage();

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

    // Get Data for Selected Date
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dailyData = forecast ? forecast[dateStr] : null;

    // Generate session cards based on REAL hourly data
    const sessionCards = dailyData ? SESSIONS.map((session) => {
        const targetHour = parseInt(session.time.split(':')[0]);

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
    }) : [];

    const currentWeather = dailyData ? {
        temperature: dailyData.hourly[0]?.temperature || 0,
        windSpeed: dailyData.hourly[0]?.windSpeed || 0,
        waveHeight: dailyData.hourly[0]?.waveHeight || 0,
    } : null;

    const locale = language === 'es' ? 'es-CL' : 'en-US';

    return (
        <div className="w-full flex flex-col pb-10 bg-deep-indigo min-h-screen">

            {/* 1. Header Component (Sticky, in flow) */}
            <Header />

            {/* 2. Map Section (Below Header) */}
            <section className="relative w-full h-[600px]">
                <div className="relative w-full h-full z-[0]">
                    <OpenMap
                        location={location}
                        onLocationSelect={onLocationSelect}
                        className="w-full h-full rounded-none" // Removed border/radius for full width integration
                    />
                </div>

                {/* Location Info Overlay - Positioned relative to this section */}
                <div className="absolute top-8 left-8 z-[50] w-80 pointer-events-none">
                    <LocationCard
                        location={location}
                        weather={currentWeather}
                        className="glass-morphism rounded-3xl p-6 pointer-events-auto shadow-2xl border-white/20"
                    />
                </div>

                {/* Gradient Bottom Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-deep-indigo to-transparent z-[40] pointer-events-none" />
            </section>

            {/* 3. Date Selection (Floating Pill) */}
            <section className="w-full px-6 -mt-6 relative z-[60] pointer-events-none">
                <div className="flex justify-center">
                    <div className="glass-morphism p-1 rounded-full inline-flex pointer-events-auto">
                        <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />
                    </div>
                </div>
            </section>

            {/* Forecast Section */}
            <main className="container mx-auto px-6 py-12 space-y-12">
                {error ? (
                    <WeatherError message={error} onRetry={loadWeather} />
                ) : !location ? (
                    <div className="text-center text-foreground/60 mt-10 text-lg">Select a location on the map to see the forecast</div>
                ) : (forecast && !loading) || loading ? (
                    <div className="flex flex-col gap-12">

                        {!dailyData ? (
                            <div className="text-center text-foreground/60 mt-10 p-10 glass-morphism rounded-2xl">
                                No forecast data available for this date.
                            </div>
                        ) : (
                            <>
                                {/* Recommended Sessions (Stitch ID: 152) */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <CheckCircle className="text-primary w-6 h-6" /> {/* Verified Icon replacement */}
                                        <h3 className="text-xl font-bold text-foreground tracking-wide">Recommended Sessions</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {sessionCards.map((card) => (
                                            <SessionCard
                                                key={card.id}
                                                label={card.id}
                                                time={card.time}
                                                conditions={card.conditions}
                                                level={card.level}
                                                loading={loading}
                                            />
                                        ))}
                                    </div>
                                </section>

                                {/* Info Bar / Full Forecast */}
                                <SunTideBar
                                    sunrise={dailyData.sunrise}
                                    sunset={dailyData.sunset}
                                    lowTide={dailyData.lowTideTime}
                                    loading={loading}
                                />

                                {/* Warning */}
                                <SafetyWarning />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-foreground mt-20 animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-lg font-medium">Loading forecast data...</span>
                    </div>
                )}
            </main>
        </div>
    );
}
