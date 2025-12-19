"use client";

import React from "react";

interface MonthSummaryProps {
    totalDistance: number;
    targetDistance: number;
    month: string;
}

export default function MonthSummary({
    totalDistance = 8.2,
    targetDistance = 25,
    month = "Dec",
}: MonthSummaryProps) {
    const percentage = Math.min((totalDistance / targetDistance) * 100, 100);

    return (
        <div className="bg-white border border-gray-200 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            {/* Decorative Background Elements - Kept subtle */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">
                        Total Distance ({month})
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-text-dark tracking-tighter">
                            {totalDistance}
                        </span>
                        <span className="text-lg text-text-muted font-bold">km</span>
                    </div>
                </div>
                <div className="bg-primary/5 p-3 rounded-full text-primary">
                    <span className="material-symbols-outlined text-3xl">directions_walk</span>
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-primary">Progress</span>
                    <span className="text-text-muted">Target: {targetDistance} km</span>
                </div>
                <div className="w-full bg-surface h-3 rounded-full overflow-hidden border border-border-light">
                    <div
                        className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(0,88,163,0.3)] relative transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20"></div>
                    </div>
                </div>
                <p className="text-[10px] text-text-muted mt-2 font-medium">
                    You're on track to reach your monthly goal!
                </p>
            </div>
        </div>
    );
}
