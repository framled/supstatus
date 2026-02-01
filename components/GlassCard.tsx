import { ReactNode } from "react";
import clsx from "clsx";

interface GlassCardProps {
    layout?: 'vertical' | 'horizontal';
    icon?: ReactNode;
    label: string;
    value: string;
    className?: string;
}

export function GlassCard({ layout = 'vertical', icon, label, value, className }: GlassCardProps) {
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
                <span className="text-white font-semibold">{value}</span>
            </div>
        </div>
    );
}
