"use client";

import { Location, SuitabilityLevel } from "@/lib/types";
import { Wind, CheckCircle, Sun } from "lucide-react";
import { SuitabilityBadge } from "./SuitabilityBadge";
import clsx from "clsx";
import { useUnit } from "@/lib/units";

interface LocationCardProps {
    location: Location | null;
    weather?: {
        temperature: number;
        windSpeed: number;
        waveHeight: number;
    } | null;
    suitability?: SuitabilityLevel;
    className?: string;
    compact?: boolean;
}

export function LocationCard({ location, weather, suitability, className, compact = false }: LocationCardProps) {
    const { convertSpeed } = useUnit();

    if (!location) return null;

    if (compact) {
        return (
            <div className={clsx("flex items-center justify-between px-6 py-4 bg-deep-indigo border-b border-white/10", className)}>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{location.name}</h2>
                        {suitability && <SuitabilityBadge level={suitability} variant="led" />}
                    </div>
                    <p className="text-white/60 text-xs">{location.region || "Chile"}</p>
                </div>

                {weather && (
                    <div className="flex items-center gap-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-light text-white">{weather.temperature.toFixed(0)}°</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Wind className="w-4 h-4 text-sunset-purple" />
                            <span className="text-sm font-semibold text-white">{convertSpeed(weather.windSpeed)}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={clsx("glass-morphism rounded-3xl p-6 pointer-events-auto shadow-2xl border-white/10 transition-all duration-300", className)}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{location.name}</h2>
                    <p className="text-foreground/60 text-sm">{location.region || "Valparaíso Region"}</p>
                </div>
                <div className="bg-sunset-orange/20 p-2 rounded-xl">
                    <Sun className="w-6 h-6 text-sunset-orange" />
                </div>
            </div>

            {weather && (
                <div className="space-y-4">
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-light text-foreground leading-none">{weather.temperature.toFixed(0)}°</span>
                        <span className="text-xl text-foreground/40 mb-1">C</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-foreground/40 mb-1">Wind</span>
                            <div className="flex items-center gap-1">
                                <Wind className="w-4 h-4 text-sunset-purple" />
                                <span className="font-semibold text-foreground">{convertSpeed(weather.windSpeed)} SW</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-foreground/40 mb-1">Conditions</span>
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="font-semibold text-foreground">Optimal</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-foreground/70 italic leading-relaxed">
                    "Perfect glassy conditions for a sunset paddle session. Mild offshore breeze expected."
                </p>
            </div>
        </div>
    );
}
