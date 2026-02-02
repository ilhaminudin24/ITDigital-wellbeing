"use client";

import { useEffect, useMemo } from "react";
import ProgressRing from "@/components/dashboard/ProgressRing";
import MonthlyStatus from "@/components/dashboard/MonthlyStatus";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";
import { useActivities } from "@/lib/hooks/useActivities";
import { useAdmin } from "@/lib/hooks/useAdmin";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { profile, isLoading: profileLoading, targets } = useProfile();
    const {
        activities,
        isLoading: activitiesLoading,
        monthlyStats,
        yearlyCalories,
        selectedMonth
    } = useActivities();

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    // Redirect if profile not completed
    useEffect(() => {
        if (!profileLoading && user && profile && !profile.profile_completed) {
            router.push('/login');
        }
    }, [profileLoading, user, profile, router]);

    // Get recent activities (last 3)
    const recentActivities = useMemo(() => {
        return activities.slice(0, 3);
    }, [activities]);

    // Get current month calories
    const currentMonthCalories = useMemo(() => {
        return monthlyStats[selectedMonth] || 0;
    }, [monthlyStats, selectedMonth]);

    const isLoading = authLoading || profileLoading || activitiesLoading;

    if (isLoading || !user) {
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
                                Halo, {profile?.name || 'Coworker'}!
                            </h2>
                            <p className="text-text-muted text-sm font-medium">
                                Let's hit that {((profile?.target_calories || targets?.yearlyTarget || 0) / 1000).toFixed(0)}K cal goal.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <NotificationBell />
                        <button
                            onClick={() => router.push('/profile')}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-primary"
                        >
                            <span className="material-symbols-outlined">person</span>
                        </button>
                    </div>
                </header>

                <main className="flex flex-col px-6 gap-6 w-full">
                    {/* Yearly Progress */}
                    <ProgressRing
                        currentCalories={yearlyCalories || profile?.total_calories || 0}
                        targetCalories={profile?.target_calories || targets?.yearlyTarget || 127500}
                    />

                    {/* Current Goal */}
                    <MonthlyStatus
                        currentCalories={currentMonthCalories}
                        targetCalories={profile?.target_calories || targets?.yearlyTarget || 127500}
                    />

                    {/* Quick Action */}
                    <button
                        onClick={() => router.push('/record')}
                        className="w-full bg-primary hover:bg-[#004f93] active:scale-[0.98] transition-all text-white font-bold text-lg h-14 rounded-full flex items-center justify-center gap-2 shadow-md"
                    >
                        <span className="material-symbols-outlined filled text-accent">directions_walk</span>
                        Record Activity
                    </button>

                    {/* Recent Walks */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-text-dark font-bold text-lg">Recent Activities</h4>
                            <button
                                onClick={() => router.push('/history')}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {recentActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-white border border-gray-200 text-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">directions_walk</span>
                                    <p className="text-text-muted text-sm">No activities yet</p>
                                    <p className="text-text-muted text-xs">Start recording your walks!</p>
                                </div>
                            ) : (
                                recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center gap-4 p-3 rounded-none bg-white border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => router.push('/history')}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">local_fire_department</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-text-dark font-medium">
                                                {activity.location}
                                            </p>
                                            <p className="text-text-muted text-xs">
                                                {activity.distance} km • {new Date(activity.activity_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-text-dark font-bold">{activity.calories} cal</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
