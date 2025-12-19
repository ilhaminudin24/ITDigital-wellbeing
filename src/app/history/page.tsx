"use client";

import React from "react";
import MonthSummary from "@/components/history/MonthSummary";
import ActivityList from "@/components/history/ActivityList";



export default function HistoryPage() {
    const [month, setMonth] = React.useState("Dec");
    const [isLoading, setIsLoading] = React.useState(false);

    // Mock Data Sets
    const decActivities = [
        { date: { day: 12, month: "Dec" }, title: "IKEA → BSD Green Office", duration: "45 min", distance: "2.4 km" },
        { date: { day: 10, month: "Dec" }, title: "Alam Sutera Loop", duration: "52 min", distance: "3.1 km" },
        { date: { day: 5, month: "Dec" }, title: "Lunch Walk", duration: "20 min", distance: "1.5 km" },
        { date: { day: 2, month: "Dec" }, title: "Morning Commute", duration: "15 min", distance: "1.2 km" },
    ];

    const novActivities = [
        { date: { day: 28, month: "Nov" }, title: "Evening Stroll", duration: "30 min", distance: "2.0 km" },
        { date: { day: 20, month: "Nov" }, title: "Power Walk", duration: "40 min", distance: "3.5 km" },
        { date: { day: 15, month: "Nov" }, title: "To Coffee Shop", duration: "10 min", distance: "0.8 km" },
    ];

    const [activities, setActivities] = React.useState(decActivities);
    const [stats, setStats] = React.useState({ total: 8.2, target: 25 });

    const handleMonthChange = (newMonth: string) => {
        setIsLoading(true);
        setMonth(newMonth);

        // Simulate loading
        setTimeout(() => {
            if (newMonth === "Nov") {
                setActivities(novActivities);
                setStats({ total: 15.4, target: 25 });
            } else {
                setActivities(decActivities);
                setStats({ total: 8.2, target: 25 });
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">
                            Activity History
                        </h2>
                        <p className="text-text-muted text-sm font-medium">
                            Keep track of your progress.
                        </p>
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
                        totalDistance={stats.total}
                        targetDistance={stats.target}
                        month={month}
                    />
                    <ActivityList
                        activities={activities}
                        month={month}
                        onMonthChange={handleMonthChange}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </div>
    );
}
