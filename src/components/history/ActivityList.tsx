"use client";

import React from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityList() {
    const activities = [
        {
            date: { day: 12, month: "Dec" },
            title: "IKEA → BSD Green Office",
            duration: "45 min",
            distance: "2.4 km",
        },
        {
            date: { day: 10, month: "Dec" },
            title: "Alam Sutera Loop",
            duration: "52 min",
            distance: "3.1 km",
        },
        {
            date: { day: 5, month: "Dec" },
            title: "Lunch Walk",
            duration: "20 min",
            distance: "1.5 km",
        },
        {
            date: { day: 2, month: "Dec" },
            title: "Morning Commute",
            duration: "15 min",
            distance: "1.2 km",
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-text-dark font-bold text-lg">Activities</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1 text-xs font-bold bg-white text-text-muted hover:text-primary hover:border-primary transition-all">
                        Dec 2024
                        <span className="material-symbols-outlined !text-[18px]">
                            expand_more
                        </span>
                    </button>
                    <button className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-text-muted hover:text-primary hover:border-primary transition-all">
                        <span className="material-symbols-outlined !text-[18px]">tune</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col bg-white border border-gray-200 shadow-sm">
                {activities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} isLast={index === activities.length - 1} />
                ))}
            </div>
        </div>
    );
}
