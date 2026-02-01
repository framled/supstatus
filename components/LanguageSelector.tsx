"use client";

import { useLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-cream"
            >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{language}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 glass-panel rounded-xl overflow-hidden border border-white/10 shadow-xl z-50 flex flex-col">
                    <button
                        onClick={() => { setLanguage('es'); setIsOpen(false); }}
                        className={clsx(
                            "px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors",
                            language === 'es' ? "text-white font-bold bg-white/5" : "text-cream/70"
                        )}
                    >
                        Español
                    </button>
                    <button
                        onClick={() => { setLanguage('en'); setIsOpen(false); }}
                        className={clsx(
                            "px-4 py-3 text-sm text-left hover:bg-white/10 transition-colors",
                            language === 'en' ? "text-white font-bold bg-white/5" : "text-cream/70"
                        )}
                    >
                        English
                    </button>
                </div>
            )}
        </div>
    );
}
