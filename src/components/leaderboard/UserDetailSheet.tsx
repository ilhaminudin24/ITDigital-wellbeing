"use client";

import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { leaderboardService, LeaderboardEntry } from "@/lib/services/leaderboard.service";
import ActivityItem from "@/components/history/ActivityItem";

interface UserDetailProps {
    userId: string | null;
    userInfo: LeaderboardEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function UserDetailSheet({ userId, userInfo, isOpen, onClose }: UserDetailProps) {
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const startY = useRef<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch activities when user changes
    useEffect(() => {
        const fetchActivities = async () => {
            if (!userId || !isOpen) return;

            setIsLoading(true);
            setError(null);
            try {
                const data = await leaderboardService.getUserRecentActivities(userId);
                // Map database fields to ActivityItem props format if needed
                // The DB returns: activity_date (string "YYYY-MM-DD")
                // ActivityItem expects: date object { day, month }
                const formattedData = data?.map(act => {
                    const dateObj = new Date(act.activity_date);
                    return {
                        ...act,
                        title: act.location || "Activity", // Use location as title per design
                        date: {
                            day: dateObj.getDate(),
                            month: dateObj.toLocaleString('default', { month: 'short' })
                        },
                        calories: act.calories,
                        distance: act.distance,
                        photo: act.photo_url,
                        location: act.location
                    };
                }) || [];

                setActivities(formattedData);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError("Gagal memuat aktivitas.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && userId) {
            fetchActivities();
        } else {
            setActivities([]); // Reset on close
        }
    }, [userId, isOpen]);

    // Focus Lock & Body Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setDragOffset(0);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    // Swipe Logic (Mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        const touchscreenY = e.touches[0].clientY;
        const modalTop = modalRef.current?.getBoundingClientRect().top || 0;

        // Only enable drag if touching the top header area
        if (touchscreenY < modalTop + 100) {
            startY.current = touchscreenY;
            setIsDragging(true);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || startY.current === null) return;
        const currentY = e.touches[0].clientY;
        const delta = currentY - startY.current;
        if (delta > 0) {
            setDragOffset(delta);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        startY.current = null;

        if (dragOffset > 100) {
            handleClose();
        } else {
            setDragOffset(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Sheet / Modal */}
            <div
                ref={modalRef}
                className={clsx(
                    "relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col transition-transform duration-500",
                    "max-h-[85vh]", // Taller on purpose
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
                style={{
                    transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                    transform: isDragging ? `translateY(${dragOffset}px)` : isOpen ? "translateY(0)" : "translateY(100%)",
                    transition: isDragging ? "none" : undefined,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full z-30 sm:hidden" />

                {/* Header Section */}
                <div className="pt-8 pb-4 px-6 border-b border-gray-100 bg-white rounded-t-3xl z-20">
                    <div className="flex items-start justify-between">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                                    {userInfo?.avatar_url ? (
                                        <img src={userInfo.avatar_url} alt={userInfo.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {userInfo?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {/* Rank Badge */}
                                {userInfo?.rank && userInfo.rank <= 3 && (
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        #{userInfo.rank}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                    {userInfo?.name}
                                </h2>
                                <div className="flex items-center gap-1.5 mt-1 text-primary">
                                    <span className="material-symbols-outlined text-lg filled">local_fire_department</span>
                                    <span className="font-bold text-lg">{leaderboardService.formatCalories(userInfo?.total_calories || 0)}</span>
                                    <span className="text-sm font-medium opacity-80">cal collected</span>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                </div>

                {/* Activities List */}
                <div
                    className="flex-1 overflow-y-auto bg-gray-50/50 p-0"
                    style={{ minHeight: '300px' }}
                >
                    <div className="px-6 py-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                        {/* Maybe a 'View Full Profile' button later */}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Loading activities...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500 text-sm px-6">
                            {error}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                            <span className="material-symbols-outlined text-4xl opacity-20">history_off</span>
                            <p className="text-sm">No activity recorded yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white">
                            {activities.map((activity, index) => (
                                <ActivityItem
                                    key={activity.id || index}
                                    {...activity}
                                    isLast={index === activities.length - 1}
                                // Make it non-clickable/read-only visually if desired, 
                                // or just don't pass onClick to make it static
                                />
                            ))}
                        </div>
                    )}

                    {/* Padding bottom for safe area */}
                    <div className="h-6 bg-white"></div>
                </div>
            </div>
        </div>
    );
}
