"use client";

import { useState } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { Location } from "@/lib/types";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center p-4 md:p-10 font-sans">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Chile SUP
            </h1>
            <p className="text-white/60 text-sm mt-1">Coastal Weather & Conditions Dashboard</p>
          </div>
          <LocationSelector onSelect={setSelectedLocation} />
        </header>

        {/* Dynamic Dashboard */}
        <WeatherDashboard location={selectedLocation} />
      </div>
    </main>
  );
}
