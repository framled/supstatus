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
import { CheckCircle, List } from "lucide-react";
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
    const allSessionCards = dailyData ? SESSIONS.map((session) => {
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

    // Determine Logic for Recommended Session
    // 1. Filter for future sessions if today
    // 2. Sort by lowest wind speed (best condition generally for SUP)
    const currentHour = new Date().getHours();
    const isToday = dateStr === new Date().toISOString().split('T')[0];

    const futureSessions = allSessionCards.filter(session => {
        if (!isToday) return true; // If tomorrow/other date, all sessions are valid
        const sessionHour = parseInt(session.time.split(':')[0]);
        return sessionHour > currentHour;
    });

    // Sort by wind speed (ascending) to find the "best" condition
    const recommendedSession = [...futureSessions].sort((a, b) => a.conditions.windSpeed - b.conditions.windSpeed)[0];

    const currentWeather = dailyData ? {
        temperature: dailyData.hourly[0]?.temperature || 0,
        windSpeed: dailyData.hourly[0]?.windSpeed || 0,
        waveHeight: dailyData.hourly[0]?.waveHeight || 0,
    } : null;

    const currentLevel = currentWeather ? determineRequiredLevel({
        windSpeed: currentWeather.windSpeed,
        waveHeight: currentWeather.waveHeight,
        temperature: currentWeather.temperature
    } as any) : undefined;

    const locale = language === 'es' ? 'es-CL' : 'en-US';

    return (
        <div className="w-full flex flex-col pb-10 bg-deep-indigo min-h-screen">

            {/* 1. Header Component (Sticky, in flow) */}
            <Header />

            {/* 2. Map Section (Below Header) */}
            <section className="relative w-full h-[600px] flex flex-col">
                {/* Mobile Location Header (Above Map) */}
                <div className="md:hidden w-full z-[70] bg-deep-indigo relative">
                    <LocationCard
                        location={location}
                        weather={currentWeather}
                        suitability={currentLevel}
                        compact={true}
                        className="rounded-none border-b border-white/10"
                    />
                </div>

                <div className="relative w-full h-full z-[0] flex-1">
                    <OpenMap
                        location={location}
                        onLocationSelect={onLocationSelect}
                        className="w-full h-full rounded-none"
                    />
                </div>

                {/* Desktop Location Info Overlay */}
                <div className="hidden md:block absolute top-8 left-8 z-[50] w-80 pointer-events-none">
                    <LocationCard
                        location={location}
                        weather={currentWeather}
                        suitability={currentLevel}
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
                                {/* Recommended Session (Best Next) */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <CheckCircle className="text-sunset-orange w-6 h-6" />
                                        {/* @ts-ignore - t.sections is valid but TS might not infer update yet */}
                                        <h3 className="text-xl font-bold text-foreground tracking-wide">{t.sections?.recommended || "Recommended Session"}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recommendedSession ? (
                                            <SessionCard
                                                key={recommendedSession.id}
                                                label={recommendedSession.id}
                                                time={recommendedSession.time}
                                                conditions={recommendedSession.conditions}
                                                level={recommendedSession.level}
                                                loading={loading}
                                            />
                                        ) : (
                                            <div className="col-span-full p-6 glass-morphism rounded-xl text-center text-white/60">
                                                No more recommended sessions for today. Check back tomorrow!
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* All Sessions (Unfiltered) */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <List className="text-white/60 w-6 h-6" />
                                        {/* @ts-ignore */}
                                        <h3 className="text-xl font-bold text-foreground tracking-wide">{t.sections?.allSessions || "All Sessions"}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {allSessionCards.map((card) => (
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
