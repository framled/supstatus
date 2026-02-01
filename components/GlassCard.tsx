import { ReactNode } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface GlassCardProps {
    layout?: 'vertical' | 'horizontal';
    icon?: ReactNode;
    label: string;
    value: string;
    loading?: boolean;
    className?: string;
}

export function GlassCard({ layout = 'vertical', icon, label, value, loading = false, className }: GlassCardProps) {
    return (
        <div className={clsx(
            "glass-panel rounded-2xl p-4 flex",
            layout === 'vertical' ? "flex-col items-center justify-center text-center gap-2" : "flex-row items-center gap-4",
            className
        )}>
            {icon && (
                <div className="shrink-0">
                    {icon}
                </div>
            )}

            <div className={clsx("flex flex-col", layout === 'vertical' ? "items-center" : "items-start")}>
                <span className="text-cream/60 text-xs uppercase tracking-wider">{label}</span>
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white my-1" />
                ) : (
                    <span className="text-white font-semibold">{value}</span>
                )}
            </div>
        </div>
    );
}
