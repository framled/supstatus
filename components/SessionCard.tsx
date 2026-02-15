"use client";

import { SuitabilityBadge } from "./SuitabilityBadge";
import { SuitabilityLevel } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { Wind, Waves, Thermometer, Loader2 } from "lucide-react";
import { useUnit } from "@/lib/units";

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
    const { t } = useLanguage();
    const { convertSpeed } = useUnit();

    // Using mapping from types to translation keys if necessary or directly logic
    const bottomText =
        level === 'Junior' ? t.session.conditions.junior :
            level === 'Intermediate' ? t.session.conditions.intermediate :
                t.session.conditions.senior;

    const ValueDisplay = ({ value, unit }: { value: string | number, unit: string }) => {
        if (loading) return <Loader2 className="w-4 h-4 animate-spin text-white" />;
        return <span className="text-white text-sm font-mono font-bold">{value}{unit}</span>;
    };

    return (
        <div className="glass-morphism p-5 rounded-3xl flex flex-col gap-4 group transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:!bg-white/5 hover:backdrop-blur-xl">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-xl mb-0.5">{time}</span>
                    {/* @ts-ignore */}
                    <span className="text-white/80 text-sm font-light">{t.session[label] || label}</span>
                </div>
                <SuitabilityBadge level={level} />
            </div>

            <div className="h-px bg-white/10 w-full my-1" />

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Wind className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{t.session.wind}</p>
                        <p className="text-sm font-bold text-white">{convertSpeed(conditions.windSpeed)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Waves className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{t.session.swell}</p>
                        <ValueDisplay value={`${conditions.waveHeight}m 10s`} unit="" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Thermometer className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{t.session.water}</p>
                        <ValueDisplay value={conditions.temperature} unit="°C" />
                    </div>
                </div>
            </div>

            <p className="text-xs mt-2 text-white/60 italic border-t border-white/5 pt-3">
                {bottomText}
            </p>
        </div>
    );
}
