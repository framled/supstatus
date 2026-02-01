"use client";

import { useEffect, useState } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { Location } from "@/lib/types";
import { LOCATIONS } from "@/lib/locations";
import { findClosestLocation } from "@/lib/geo";

function DashboardContent() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // 1. Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const closest = findClosestLocation(latitude, longitude, LOCATIONS);
          if (closest) {
            setSelectedLocation(closest);
          } else {
            // Fallback: Default to Pichilemu if logic fails
            const pichilemu = LOCATIONS.find(l => l.id === "pichilemu");
            if (pichilemu) setSelectedLocation(pichilemu);
          }
        },
        (error) => {
          console.log("Geolocation denied or error:", error);
          // Fallback: Default to Pichilemu
          const pichilemu = LOCATIONS.find(l => l.id === "pichilemu");
          if (pichilemu) setSelectedLocation(pichilemu);
        }
      );
    } else {
      // Fallback: Geolocation not supported
      const pichilemu = LOCATIONS.find(l => l.id === "pichilemu");
      if (pichilemu) setSelectedLocation(pichilemu);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-10 font-sans text-cream">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-start justify-between w-full md:w-auto md:justify-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Chile <span className="text-primary">SUP</span>
              </h1>
              <p className="text-cream/80 text-sm mt-1 font-medium tracking-wide">{t.header.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <LanguageSelector />
            <div className="flex-1 md:flex-none">
              <LocationSelector onSelect={setSelectedLocation} />
            </div>
          </div>
        </header>

        {/* Dynamic Dashboard */}
        <WeatherDashboard location={selectedLocation} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}
