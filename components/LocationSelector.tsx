"use client";

import { MapPin } from "lucide-react";
import { LOCATIONS } from "@/lib/locations";

export function LocationSelector({ onSelect }: { onSelect?: (location: any) => void }) {
    return (
        <div className="flex items-center gap-2 glass-panel p-2 rounded-lg hover:border-primary/50 transition-colors">
            <MapPin className="text-primary w-5 h-5" />
            <select
                className="bg-transparent border-none outline-none text-cream font-medium cursor-pointer focus:ring-0"
                onChange={(e) => {
                    const loc = LOCATIONS.find(l => l.id === e.target.value);
                    if (loc && onSelect) onSelect(loc);
                }}
            >
                {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-indigo bg-white">
                        {loc.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
