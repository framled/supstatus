"use client";

import { SuitabilityBadge } from "./SuitabilityBadge";
import { SuitabilityLevel } from "@/lib/types";

import { Wind, Waves, Thermometer, Droplets, Loader2 } from "lucide-react";

interface SessionCardProps {
    label: string;
    time: string;
    conditions: {
        windSpeed: number;
        waveHeight: number;
        temperature: number;
    };
    level: SuitabilityLevel;
    loading?: boolean;
}

export function SessionCard({ label, time, conditions, level, loading = false }: SessionCardProps) {
    const bottomText =
        level === 'Junior' ? "Conditions suitable for beginners and non-experienced paddlers" :
            level === 'Intermediate' ? "Moderate conditions. Suitable for those with some experience" :
                "Challenging conditions. Recommended for expert paddlers only.";

    const ValueDisplay = ({ value, unit }: { value: string | number, unit: string }) => {
        if (loading) return <Loader2 className="w-4 h-4 animate-spin text-cream/70" />;
        return <span className="text-cream/90 text-sm font-mono">{value}{unit}</span>;
    };

    return (
        <div className="glass-card p-5 rounded-lg flex flex-col gap-4 group transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-xl mb-0.5">{time}</span>
                    <span className="text-cream/70 text-sm font-light">{label}</span>
                </div>
                {/* When loading, we might want to keep the previous badge or show a neutral state. 
                    For now, let's keep showing the badge if we have data, otherwise it will just re-render when data comes in. 
                    Since we pass 'conditions' from parent, if parent preserves old data during fetch, this stays stable. 
                */}
                <SuitabilityBadge level={level} />
            </div>

            <div className="h-px bg-white/10 w-full my-1" />

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-cream/70" />
                    <div className="flex justify-between w-full">
                        <span className="text-white text-sm font-medium">Wind</span>
                        <ValueDisplay value={conditions.windSpeed} unit="kt" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Waves className="w-5 h-5 text-cream/70" />
                    <div className="flex justify-between w-full">
                        <span className="text-white text-sm font-medium">Swell</span>
                        <ValueDisplay value={`${conditions.waveHeight}m 10s`} unit="" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-cream/70" />
                    <div className="flex justify-between w-full">
                        <span className="text-white text-sm font-medium">Water</span>
                        <ValueDisplay value={conditions.temperature} unit="°C" />
                    </div>
                </div>
            </div>

            <p className="text-xs mt-2 text-cream/60 italic border-t border-white/5 pt-3">
                {bottomText}
            </p>
        </div>
    );
}
