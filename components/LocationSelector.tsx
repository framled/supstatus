"use client";

import { MapPin } from "lucide-react";

const LOCATIONS = [
    { id: "pichilemu", name: "Pichilemu", lat: -34.3872, lon: -72.0062 },
    { id: "concon", name: "Concón", lat: -32.9213, lon: -71.5363 },
    { id: "arica", name: "Arica", lat: -18.4746, lon: -70.2979 },
    { id: "maitencillo", name: "Maitencillo", lat: -32.6369, lon: -71.4428 },
    { id: "laserena", name: "La Serena", lat: -29.9045, lon: -71.2489 },
];

export function LocationSelector({ onSelect }: { onSelect?: (location: any) => void }) {
    return (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
            <MapPin className="text-primary w-5 h-5" />
            <select
                className="bg-transparent border-none outline-none text-foreground font-medium cursor-pointer"
                onChange={(e) => {
                    const loc = LOCATIONS.find(l => l.id === e.target.value);
                    if (loc && onSelect) onSelect(loc);
                }}
            >
                {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id} className="text-black">
                        {loc.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
