"use client";

import React from "react";

interface ActivityItemProps {
    date: {
        day: number;
        month: string;
    };
    title: string;
    duration: string; // e.g., "45 min"
    distance: string; // e.g., "2.4 km"
    isLast?: boolean;
}

export default function ActivityItem({
    date = { day: 12, month: "Dec" },
    title = "IKEA → BSD Green Office",
    duration = "45 min",
    distance = "2.4 km",
    isLast = false,
}: ActivityItemProps) {
    return (
        <article
            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!isLast ? "border-b border-gray-100" : ""
                }`}
        >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-col items-center justify-center shrink-0 text-primary">
                <span className="text-[10px] font-bold uppercase tracking-tight leading-none opacity-80">
                    {date.month}
                </span>
                <span className="text-lg font-bold leading-none">
                    {date.day.toString().padStart(2, "0")}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-dark text-sm truncate mb-0.5">
                    {title}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">schedule</span>
                        {duration}
                    </span>
                    <span className="text-xs font-bold text-primary">{distance}</span>
                </div>
            </div>

            <span className="material-symbols-outlined text-gray-300 !text-[20px]">
                chevron_right
            </span>
        </article>
    );
}
