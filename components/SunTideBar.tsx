import { Sunrise, Sunset, Waves } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useLanguage } from '@/lib/i18n';

interface SunTideBarProps {
    sunrise?: string;
    sunset?: string;
    lowTide?: string;
    loading?: boolean;
}

export function SunTideBar({ sunrise, sunset, lowTide, loading = false }: SunTideBarProps) {
    const { t } = useLanguage();

    const formatTime = (isoString?: string) => {
        if (!isoString) return "--:--";
        try {
            return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return isoString; // Fallback if already formatted
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <GlassCard
                layout="vertical"
                icon={<Sunrise className="text-yellow-300 w-6 h-6" />}
                label={t.sunTide.sunrise}
                value={formatTime(sunrise)}
                loading={loading}
            />
            <GlassCard
                layout="vertical"
                icon={<Sunset className="text-primary w-6 h-6" />}
                label={t.sunTide.sunset}
                value={formatTime(sunset)}
                loading={loading}
            />
            <GlassCard
                layout="vertical"
                icon={<Waves className="text-blue-300 w-6 h-6" />}
                label={t.sunTide.lowTide}
                value={formatTime(lowTide)}
                loading={loading}
            />
        </div>
    );
}
