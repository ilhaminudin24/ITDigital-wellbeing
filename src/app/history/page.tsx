"use client";

import React, { useEffect, useState } from "react";
import MonthSummary from "@/components/history/MonthSummary";
import ActivityList from "@/components/history/ActivityList";
import ActivityDetailModal from "@/components/history/ActivityDetailModal";
import Logo from "@/components/ui/Logo";
import {
    getUser,
    getActivities,
    getMonthlyCalories,
    calculateMonthlyTarget,
    Activity as UserActivity,
    initializeMockData,
} from "@/lib/userData";

interface Activity {
    date: { day: number; month: string };
    title: string;
    calories: number;
    distance: number;
    photo?: string;
    location: string;
}

export default function HistoryPage() {
    const [month, setMonth] = useState("Jan");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState({ total: 0, target: 10625 });

    // Convert UserActivity to display Activity format
    const convertToDisplayActivity = (act: UserActivity): Activity => {
        const date = new Date(act.date);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
            date: {
                day: date.getDate(),
                month: monthNames[date.getMonth()]
            },
            title: act.location,
            calories: act.calories,
            distance: act.distance,
            photo: act.photo || undefined,
            location: act.location,
        };
    };

    // Load activities for a specific month
    const loadActivitiesForMonth = (monthName: string) => {
        const monthMap: { [key: string]: number } = {
            "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
            "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
        };

        const monthIndex = monthMap[monthName];
        const year = 2026;

        const allActivities = getActivities();
        const filtered = allActivities.filter(act => {
            const actDate = new Date(act.date);
            return actDate.getMonth() === monthIndex && actDate.getFullYear() === year;
        });

        const displayActivities = filtered.map(convertToDisplayActivity);
        const monthlyCalories = getMonthlyCalories(monthIndex, year);

        const user = getUser();
        const monthlyTarget = user ? calculateMonthlyTarget(user.targetCalories) : 10625;

        setActivities(displayActivities);
        setStats({ total: monthlyCalories, target: monthlyTarget });
    };

    useEffect(() => {
        // Initialize mock data if needed
        initializeMockData();

        // Load initial data
        loadActivitiesForMonth(month);
    }, []);

    const handleMonthChange = (newMonth: string) => {
        setIsLoading(true);
        setMonth(newMonth);

        // Simulate loading
        setTimeout(() => {
            loadActivitiesForMonth(newMonth);
            setIsLoading(false);
        }, 300);
    };

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
                    <div
                        className="h-10 w-10 rounded-full bg-surface bg-cover bg-center border border-border-light cursor-pointer shadow-sm"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCggN_k7P4__GcZiX42vSpXAA5K8yR8Ef6z7QfJ7VXB5Z72mmA9CShvrhKuXaMA3yky4N1kehsZnIHJPM2-AvxGCYEXR9XdDDAEOKZvUGUCojcwFG1IkyhFUpQoy6ESqlpvLySh0RBPe9jo-vytFxefw5yzNr1A2ZiaWzWL809jLTpFqp3mCOIfp9mdF6dFxP66BYRdwJF4CD6NrpKfiD_jD5OkPP886nR636ySoJaYksj5VoBTbk5Fi1zQbxpKQ4xQk4ZMaAjS7kpQ")',
                        }}
                    ></div>
                </header>
                <main className="flex flex-col px-6 gap-6 w-full">
                    <MonthSummary
                        totalCalories={stats.total}
                        monthlyTarget={stats.target}
                        month={month}
                    />
                    <ActivityList
                        activities={activities}
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
            />
        </div>
    );
}
