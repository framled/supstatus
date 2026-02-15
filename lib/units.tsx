"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Unit = 'kt' | 'km/h';

interface UnitContextType {
    unit: Unit;
    toggleUnit: () => void;
    convertSpeed: (speedKt: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
    const [unit, setUnit] = useState<Unit>('kt');

    const toggleUnit = () => {
        setUnit(prev => prev === 'kt' ? 'km/h' : 'kt');
    };

    const convertSpeed = (speedKt: number): string => {
        if (unit === 'kt') {
            return `${speedKt.toFixed(0)} kt`;
        } else {
            // 1 kt = 1.852 km/h
            return `${(speedKt * 1.852).toFixed(0)} km/h`;
        }
    };

    const value = {
        unit,
        toggleUnit,
        convertSpeed
    };

    return (
        <UnitContext.Provider value={value}>
            {children}
        </UnitContext.Provider>
    );
}

export function useUnit() {
    const context = useContext(UnitContext);
    if (context === undefined) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context;
}
