"use client";

import { useState } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { Location } from "@/lib/types";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-10 font-sans text-cream">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              Chile <span className="text-primary">SUP</span>
            </h1>
            <p className="text-cream/80 text-sm mt-1 font-medium tracking-wide">Coastal Weather & Conditions Dashboard</p>
          </div>
          <LocationSelector onSelect={setSelectedLocation} />
        </header>

        {/* Dynamic Dashboard */}
        <WeatherDashboard location={selectedLocation} />
      </div>
    </main>
  );
}
