import { Sunrise, Sunset, Waves } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface SunTideBarProps {
    sunrise?: string;
    sunset?: string;
    lowTide?: string;
    loading?: boolean;
}

export function SunTideBar({ sunrise, sunset, lowTide, loading = false }: SunTideBarProps) {
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
                label="Sunrise"
                value={formatTime(sunrise)}
                loading={loading}
            />
            <GlassCard
                layout="vertical"
                icon={<Sunset className="text-primary w-6 h-6" />}
                label="Sunset"
                value={formatTime(sunset)}
                loading={loading}
            />
            <GlassCard
                layout="vertical"
                icon={<Waves className="text-blue-300 w-6 h-6" />}
                label="Low Tide"
                value={formatTime(lowTide)}
                loading={loading}
            />
        </div>
    );
}
