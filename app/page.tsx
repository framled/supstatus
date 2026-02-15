"use client";

import { useEffect, useState } from "react";
import { WeatherDashboard } from "@/components/WeatherDashboard";
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
      <div className="w-full max-w-7xl">
        <WeatherDashboard
          location={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />
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
