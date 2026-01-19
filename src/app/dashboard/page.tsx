"use client";

import { useEffect, useState } from "react";
import ProgressRing from "@/components/dashboard/ProgressRing";
import MonthlyStatus from "@/components/dashboard/MonthlyStatus";
import { useRouter } from "next/navigation";
import {
    getUser,
    getActivities,
    getMonthlyCalories,
    initializeMockData,
    User,
    Activity,
} from "@/lib/userData";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [monthlyCalories, setMonthlyCalories] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize mock data if no user exists
        initializeMockData();

        const userData = getUser();
        if (!userData?.profileCompleted) {
            router.push('/login');
            return;
        }

        setUser(userData);
        setRecentActivities(getActivities().slice(0, 3));

        // Get current month calories
        const now = new Date();
        setMonthlyCalories(getMonthlyCalories(now.getMonth(), now.getFullYear()));

        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">
                            Halo, {user?.name || 'Coworker'}!
                        </h2>
                        <p className="text-text-muted text-sm font-medium">
                            Let's hit that {((user?.targetCalories || 0) / 1000).toFixed(0)}K cal goal.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/profile')}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-primary"
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>
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
                        currentCalories={user?.totalCalories || 0}
                        targetCalories={user?.targetCalories || 127500}
                    />

                    {/* Current Goal */}
                    <MonthlyStatus
                        currentCalories={monthlyCalories}
                        targetCalories={user?.targetCalories || 127500}
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
                                                {activity.distance} km • {new Date(activity.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-text-dark font-bold">{activity.calories} cal</p>
                                            <p className="text-primary text-xs">+{activity.calories} pts</p>
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
