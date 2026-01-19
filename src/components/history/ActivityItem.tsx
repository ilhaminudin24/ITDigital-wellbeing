"use client";

import React from "react";

interface ActivityItemProps {
    date: {
        day: number;
        month: string;
    };
    title: string;
    calories: number;
    distance?: number;
    photo?: string;
    isLast?: boolean;
    onClick?: () => void;
}

export default function ActivityItem({
    date = { day: 12, month: "Jan" },
    title = "BSD Green Office Park",
    calories = 350,
    distance,
    photo,
    isLast = false,
    onClick,
}: ActivityItemProps) {
    return (
        <article
            onClick={onClick}
            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!isLast ? "border-b border-gray-100" : ""
                }`}
        >
            {/* Date Badge */}
            <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-col items-center justify-center shrink-0 text-primary">
                <span className="text-[10px] font-bold uppercase tracking-tight leading-none opacity-80">
                    {date.month}
                </span>
                <span className="text-lg font-bold leading-none">
                    {date.day.toString().padStart(2, "0")}
                </span>
            </div>

            {/* Activity Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-dark text-sm truncate mb-0.5">
                    {title}
                </h3>
                <div className="flex items-center gap-3">
                    {distance !== undefined && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[14px]">straighten</span>
                            {distance} km
                        </span>
                    )}
                    <span className="text-xs text-text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">local_fire_department</span>
                        {calories} cal
                    </span>
                </div>
            </div>

            {/* Photo Thumbnail (if available) */}
            {photo && (
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                </div>
            )}

            {/* Arrow */}
            <span className="material-symbols-outlined text-gray-300 !text-[20px]">
                chevron_right
            </span>
        </article>
    );
}
