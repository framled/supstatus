import { SuitabilityBadge } from "./SuitabilityBadge";
import { SuitabilityLevel } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { Wind, Waves, Thermometer, Loader2 } from "lucide-react";

import { translations } from "@/lib/i18n";

type SessionKey = keyof typeof translations.es.session;
export type SessionLabel = Exclude<SessionKey, 'conditions'>;

interface SessionCardProps {
    label: SessionLabel; // This comes from parent, will be translated there
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

    // Using mapping from types to translation keys if necessary or directly logic
    const bottomText =
        level === 'Junior' ? t.session.conditions.junior :
            level === 'Intermediate' ? t.session.conditions.intermediate :
                t.session.conditions.senior;

    const ValueDisplay = ({ value, unit }: { value: string | number, unit: string }) => {
        if (loading) return <Loader2 className="w-4 h-4 animate-spin text-cream/70" />;
        return <span className="text-cream/90 text-sm font-mono">{value}{unit}</span>;
    };

    return (
        <div className="glass-card p-5 rounded-lg flex flex-col gap-4 group transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-xl mb-0.5">{time}</span>
                    <span className="text-cream/70 text-sm font-light">{t.session[label]}</span>
                </div>
                <SuitabilityBadge level={level} />
            </div>

            <div className="h-px bg-white/10 w-full my-1" />

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-cream/70" />
                    <div className="flex justify-between w-full">
                        <span className="text-white text-sm font-medium">{t.session.wind}</span>
                        <ValueDisplay value={conditions.windSpeed} unit="kt" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Waves className="w-5 h-5 text-cream/70" />
                    <div className="flex justify-between w-full">
                        <span className="text-white text-sm font-medium">{t.session.swell}</span>
                        <ValueDisplay value={`${conditions.waveHeight}m 10s`} unit="" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-cream/70" />
                    <div className="flex justify-between w-full">
                        <span className="text-white text-sm font-medium">{t.session.water}</span>
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
