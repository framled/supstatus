"use client";

import { Waves } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { useEffect, useState } from "react";
import clsx from "clsx";

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={clsx(
                "sticky top-0 left-0 w-full z-[100] transition-all duration-300 border-b border-white/5",
                scrolled ? "bg-deep-indigo/90 backdrop-blur-md py-3 shadow-lg" : "bg-deep-indigo py-4"
            )}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Waves className="text-sunset-orange w-8 h-8" />
                    <span className="text-2xl font-bold tracking-tight text-foreground uppercase flex items-center gap-1">
                        Chile <span className="text-sunset-orange">Sup</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </header>
    );
}
