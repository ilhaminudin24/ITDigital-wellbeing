"use client";

import React, { useState } from "react";
import ActivityItem from "./ActivityItem";
import { clsx } from "clsx";

interface Activity {
    date: { day: number; month: string };
    title: string;
    duration: string;
    distance: string;
    startPoint: string;
    endPoint: string;
}

interface ActivityListProps {
    activities: Activity[];
    month: string;
    onMonthChange: (month: string) => void;
    isLoading: boolean;
    onActivityClick: (activity: Activity) => void;
}

export default function ActivityList({ activities, month, onMonthChange, isLoading, onActivityClick }: ActivityListProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleFilterModal = () => setIsFilterModalOpen(!isFilterModalOpen);

    const handleMonthSelect = (m: string) => {
        onMonthChange(m);
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
                <h3 className="text-text-dark font-bold text-lg">Activities</h3>
                <div className="flex gap-2 relative">
                    {/* Month Filter Button */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1 text-xs font-bold bg-white text-text-muted hover:text-primary hover:border-primary transition-all"
                        >
                            {month} 2024
                            <span className={clsx("material-symbols-outlined !text-[18px] transition-transform", isDropdownOpen && "rotate-180")}>
                                expand_more
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 flex flex-col overflow-hidden">
                                {["Dec", "Nov", "Oct"].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => handleMonthSelect(m)}
                                        className={clsx(
                                            "px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 transition-colors",
                                            month === m ? "text-primary bg-primary/5" : "text-slate-600"
                                        )}
                                    >
                                        {m} 2024
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter Icon */}
                    <button
                        onClick={toggleFilterModal}
                        className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-text-muted hover:text-primary hover:border-primary transition-all"
                    >
                        <span className="material-symbols-outlined !text-[18px]">tune</span>
                    </button>
                </div>
            </div>

            {/* List with Loading State */}
            <div className={clsx(
                "flex flex-col bg-white border border-gray-200 shadow-sm transition-opacity duration-300 min-h-[100px]",
                isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            )}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {activities.map((activity, index) => (
                    <div
                        key={index}
                        className="group hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onActivityClick(activity)}
                    >
                        <ActivityItem {...activity} isLast={index === activities.length - 1} />
                    </div>
                ))}

                {activities.length === 0 && !isLoading && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No activities found for this month.
                    </div>
                )}
            </div>

            {/* Filter Modal / Bottom Sheet */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Filter Activities</h3>
                            <button onClick={toggleFilterModal} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md">Newest</button>
                                    <button className="flex-1 py-2.5 rounded-xl bg-gray-100 text-slate-600 text-sm font-bold hover:bg-gray-200">Oldest</button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 rounded-full border-2 border-primary text-primary text-xs font-bold">Walking</button>
                                    <button className="px-4 py-2 rounded-full border border-gray-200 text-slate-500 text-xs font-bold hover:border-gray-400">Running</button>
                                    <button className="px-4 py-2 rounded-full border border-gray-200 text-slate-500 text-xs font-bold hover:border-gray-400">Cycling</button>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    onMonthChange(month); // Refresh list
                                    toggleFilterModal();
                                }}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-[#004f93] active:scale-[0.98] transition-all mt-2"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
