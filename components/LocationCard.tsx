"use client";

import { Location } from "@/lib/types";
import { Wind, CheckCircle, Sun } from "lucide-react";
import clsx from "clsx";

interface LocationCardProps {
    location: Location | null;
    weather?: {
        temperature: number;
        windSpeed: number;
        waveHeight: number;
    } | null;
    className?: string;
}

export function LocationCard({ location, weather, className }: LocationCardProps) {
    if (!location) return null;

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
                                <span className="font-semibold text-foreground">{weather.windSpeed.toFixed(0)} kt SW</span>
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
