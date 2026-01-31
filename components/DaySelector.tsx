"use client";

import { useRef, useEffect } from "react";
import clsx from "clsx";

interface DaySelectorProps {
    selectedDate: Date;
    onSelect: (date: Date) => void;
}

export function DaySelector({ selectedDate, onSelect }: DaySelectorProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate next 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(new Date().getDate() + i);
        return d;
    });

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth();

    const formatDay = (date: Date, index: number) => {
        if (index === 0) return "Today";
        if (index === 1) return "Tomorrow";
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    };

    return (
        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-4" ref={scrollRef}>
            <div className="flex gap-3 min-w-max px-1">
                {days.map((date, idx) => {
                    const selected = isSameDay(date, selectedDate);
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelect(date)}
                            className={clsx(
                                "flex flex-col items-center justify-center px-5 py-2 rounded-xl transition-all duration-300 border backdrop-blur-md",
                                selected
                                    ? "bg-white/20 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-cream/60"
                            )}
                        >
                            <span className={clsx("text-xs font-bold uppercase tracking-wider", selected ? "text-white" : "text-cream/50")}>
                                {idx === 0 ? "Now" : date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className={clsx("text-sm font-semibold whitespace-nowrap", selected ? "text-white" : "text-cream/80")}>
                                {formatDay(date, idx)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
