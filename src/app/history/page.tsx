"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MonthSummary from "@/components/history/MonthSummary";
import ActivityList from "@/components/history/ActivityList";
import ActivityDetailModal from "@/components/history/ActivityDetailModal";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";
import { useActivities } from "@/lib/hooks/useActivities";

interface Activity {
    id?: string;
    date: { day: number; month: string };
    title: string;
    activity_type?: string;
    calories: number;
    distance: number;
    photo?: string;
    location: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { profile, targets } = useProfile();
    const {
        filteredActivities,
        isLoading: activitiesLoading,
        selectedMonth,
        setSelectedMonth,
        monthlyStats,
        deleteActivity
    } = useActivities();

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [month, setMonth] = useState(monthNames[new Date().getMonth()]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    // Convert Supabase activity to display format
    const displayActivities = useMemo(() => {
        return filteredActivities.map(act => {
            const date = new Date(act.activity_date);
            return {
                id: act.id,
                date: {
                    day: date.getDate(),
                    month: monthNames[date.getMonth()]
                },
                title: act.location,
                activity_type: act.activity_type,
                calories: act.calories,
                distance: act.distance,
                photo: act.photo_url || undefined,
                location: act.location,
            };
        });
    }, [filteredActivities]);

    // Calculate stats for current month
    const stats = useMemo(() => {
        const monthlyCalories = monthlyStats[selectedMonth] || 0;
        const monthlyTarget = targets ? Math.round(targets.yearlyTarget / 12) : 10625;
        return { total: monthlyCalories, target: monthlyTarget };
    }, [monthlyStats, selectedMonth, targets]);

    const handleMonthChange = (newMonth: string) => {
        setIsLoading(true);
        setMonth(newMonth);

        const monthIndex = monthNames.indexOf(newMonth);
        setSelectedMonth(monthIndex);

        // Brief loading state for UX
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    // Handle delete activity
    const handleDeleteActivity = async (id: string) => {
        setIsDeleting(true);
        try {
            await deleteActivity(id);
            setSelectedActivity(null);
        } finally {
            setIsDeleting(false);
        }
    };

    if (authLoading || activitiesLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background-light gap-4">
                <div className="animate-pulse">
                    <Logo size="xl" />
                </div>
                <p className="text-sm text-slate-500 animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                        <Logo size="md" />
                        <div className="flex flex-col">
                            <h2 className="text-primary text-xl font-bold leading-tight tracking-tight">
                                Activity History
                            </h2>
                            <p className="text-text-muted text-sm font-medium">
                                Keep track of your progress.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/profile')}
                        className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">person</span>
                    </button>
                </header>
                <main className="flex flex-col px-6 gap-6 w-full">
                    <MonthSummary
                        totalCalories={stats.total}
                        monthlyTarget={stats.target}
                        month={month}
                    />
                    <ActivityList
                        activities={displayActivities}
                        month={month}
                        onMonthChange={handleMonthChange}
                        isLoading={isLoading}
                        onActivityClick={setSelectedActivity}
                    />
                </main>
            </div>

            {/* Slide-Up Modal */}
            <ActivityDetailModal
                activity={selectedActivity}
                onClose={() => setSelectedActivity(null)}
                onDelete={handleDeleteActivity}
                isDeleting={isDeleting}
            />
        </div>
    );
}
