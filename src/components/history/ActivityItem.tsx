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
    activityType?: string;
    photo?: string;
    isLast?: boolean;
    onClick?: () => void;
    onPhotoClick?: (photoUrl: string) => void;
}

export default function ActivityItem({
    date = { day: 12, month: "Jan" },
    title = "BSD Green Office Park",
    calories = 350,
    distance,
    activityType,
    photo,
    isLast = false,
    onClick,
    onPhotoClick,
}: ActivityItemProps) {
    // Helper to get icon based on activity type
    const getActivityIcon = (type?: string) => {
        const t = type?.toLowerCase() || "";
        if (t.includes("run") || t.includes("lari")) return "directions_run";
        if (t.includes("walk") || t.includes("jalan")) return "directions_walk";
        if (t.includes("cycl") || t.includes("sepeda")) return "directions_bike";
        if (t.includes("swim") || t.includes("renang")) return "pool";
        if (t.includes("badminton") || t.includes("bulu")) return "sports_tennis";
        if (t.includes("padel")) return "sports_tennis";
        if (t.includes("tennis")) return "sports_tennis";
        if (t.includes("basket")) return "sports_basketball";
        if (t.includes("football") || t.includes("futsal") || t.includes("bola")) return "sports_soccer";
        if (t.includes("yoga")) return "self_improvement";
        if (t.includes("gym") || t.includes("fitness")) return "fitness_center";
        return "fitness_center";
    };

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
                <div className="flex items-center gap-3 flex-wrap">
                    {distance !== undefined && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[14px]">straighten</span>
                            {distance} km
                        </span>
                    )}
                    {activityType && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[14px]">{getActivityIcon(activityType)}</span>
                            {activityType}
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
                <div
                    className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 transition-transform active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPhotoClick?.(photo);
                    }}
                >
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
