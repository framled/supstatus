"use client";

import { useUnit } from "@/lib/units";
import { Gauge } from "lucide-react";

export function UnitSelector() {
    const { unit, toggleUnit } = useUnit();

    return (
        <button
            onClick={toggleUnit}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white"
            title="Toggle Wind Unit"
        >
            <Gauge className="w-4 h-4" />
            <span className="text-sm font-medium uppercase min-w-[3ch] text-center">{unit === 'km/h' ? 'KPH' : 'KT'}</span>
        </button>
    );
}
