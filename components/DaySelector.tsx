"use client";

import clsx from "clsx";

interface DaySelectorProps {
    selectedDate: Date;
    onSelect: (date: Date) => void;
}

export function DaySelector({ selectedDate, onSelect }: DaySelectorProps) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = (date: Date) => date.toDateString() === selectedDate.toDateString();

    return (
        <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-md p-1 rounded-full inline-flex border border-white/10">
                <button
                    onClick={() => onSelect(today)}
                    className={clsx(
                        "px-10 py-3 rounded-full text-sm font-bold transition-all shadow-lg",
                        isToday(today)
                            ? "bg-gradient-to-r from-sunset-orange to-sunset-purple text-foreground"
                            : "text-foreground/60 hover:text-foreground bg-transparent shadow-none"
                    )}
                >
                    TODAY
                </button>
                <button
                    onClick={() => onSelect(tomorrow)}
                    className={clsx(
                        "px-10 py-3 rounded-full text-sm font-medium transition-all",
                        isToday(tomorrow)
                            ? "bg-gradient-to-r from-sunset-orange to-sunset-purple text-foreground shadow-lg font-bold"
                            : "text-foreground/60 hover:text-foreground bg-transparent"
                    )}
                >
                    TOMORROW
                </button>
            </div>
        </div>
    );
}
