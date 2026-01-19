"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Logo from "@/components/ui/Logo";
import {
    getUser,
    getYearlyCaloriesByMonth,
    initializeMockData,
    User,
} from "@/lib/userData";

export default function ReportPage() {
    const router = useRouter();
    const [year, setYear] = useState(2026);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));

    useEffect(() => {
        initializeMockData();
        const userData = getUser();
        setUser(userData);
        setMonthlyData(getYearlyCaloriesByMonth(year));
    }, [year]);

    // Calculate stats
    const totalCalories = user?.totalCalories || 0;
    const targetCalories = user?.targetCalories || 127500;
    const percent = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);
    const monthlyTarget = Math.round(targetCalories / 12);

    // Find best month
    const maxCalories = Math.max(...monthlyData);
    const bestMonthIndex = monthlyData.indexOf(maxCalories);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const bestMonth = maxCalories > 0 ? monthNames[bestMonthIndex] : "-";

    // Calculate average (only months with data)
    const monthsWithData = monthlyData.filter(m => m > 0).length;
    const avgMonthly = monthsWithData > 0 ? Math.round(totalCalories / monthsWithData) : 0;

    const remaining = Math.max(0, targetCalories - totalCalories);

    // Chart heights (normalized to max height)
    const maxHeight = Math.max(...monthlyData, monthlyTarget);
    const getBarHeight = (value: number) => {
        if (maxHeight === 0) return "5%";
        return `${Math.max(5, (value / maxHeight) * 100)}%`;
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                        <Logo size="md" />
                        <div className="flex flex-col">
                            <h2 className="text-primary text-xl font-bold leading-tight tracking-tight">
                                Progress Report
                            </h2>
                            <p className="text-text-muted text-sm font-medium">Track your achievements</p>
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
                    {/* Filter Section */}
                    <div className="flex justify-end relative">
                        <button
                            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                            className="px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1 text-xs font-bold bg-white text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                        >
                            {year}
                            <span className={clsx("material-symbols-outlined !text-[18px] transition-transform", isYearDropdownOpen && "rotate-180")}>expand_more</span>
                        </button>

                        {isYearDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden flex flex-col w-24">
                                {[2026, 2025].map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => { setYear(y); setIsYearDropdownOpen(false); }}
                                        className={clsx(
                                            "px-4 py-2 text-sm font-bold hover:bg-gray-50 text-left transition-colors",
                                            year === y ? "text-primary bg-primary/5" : "text-gray-500"
                                        )}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Yearly Goal Section */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-3xl">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Yearly Goal</p>
                        <div className="flex items-end justify-between mb-4">
                            <div className="flex items-baseline">
                                <span className="text-[42px] font-bold text-primary leading-none">
                                    {(totalCalories / 1000).toFixed(1)}K
                                </span>
                                <span className="text-xl text-gray-400 font-semibold ml-1">cal</span>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold text-lg">{percent}%</p>
                                <p className="text-gray-400 text-xs">of {(targetCalories / 1000).toFixed(0)}K cal Target</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-accent relative shadow-[0_0_10px_rgba(255,219,0,0.4)] transition-all duration-1000 ease-out"
                                style={{ width: `${percent}%` }}
                            >
                                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,.5)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.5)_50%,rgba(255,255,255,.5)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Calories Chart */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Monthly Calories</h3>
                                <p className="text-gray-400 text-sm">Jan - Dec {year}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">bar_chart</span>
                            </div>
                        </div>

                        <div className="grid min-h-[160px] grid-cols-6 items-end gap-2 sm:gap-3">
                            {monthNames.slice(0, 6).map((label, idx) => (
                                <div key={idx} className="group flex flex-col items-center gap-2">
                                    <div
                                        className={clsx(
                                            "w-full rounded-t-lg transition-all duration-700 ease-out",
                                            monthlyData[idx] === maxCalories && maxCalories > 0
                                                ? "bg-accent shadow-sm"
                                                : "bg-primary/20 group-hover:bg-primary"
                                        )}
                                        style={{ height: getBarHeight(monthlyData[idx]) }}
                                    ></div>
                                    <span className={clsx(
                                        "text-xs font-bold",
                                        monthlyData[idx] === maxCalories && maxCalories > 0 ? "text-primary" : "text-gray-400"
                                    )}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Second row for Jul-Dec */}
                        <div className="grid min-h-[160px] grid-cols-6 items-end gap-2 sm:gap-3 mt-4">
                            {monthNames.slice(6, 12).map((label, idx) => (
                                <div key={idx + 6} className="group flex flex-col items-center gap-2">
                                    <div
                                        className={clsx(
                                            "w-full rounded-t-lg transition-all duration-700 ease-out",
                                            monthlyData[idx + 6] === maxCalories && maxCalories > 0
                                                ? "bg-accent shadow-sm"
                                                : monthlyData[idx + 6] > 0
                                                    ? "bg-primary/20 group-hover:bg-primary"
                                                    : "bg-gray-100"
                                        )}
                                        style={{ height: getBarHeight(monthlyData[idx + 6]) }}
                                    ></div>
                                    <span className={clsx(
                                        "text-xs font-bold",
                                        monthlyData[idx + 6] === maxCalories && maxCalories > 0 ? "text-primary" : "text-gray-400"
                                    )}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
                            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-primary">
                                <span className="material-symbols-outlined text-[20px]">trending_up</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium">Avg/Month</p>
                                <p className="text-gray-900 text-xl font-bold">{avgMonthly.toLocaleString()} cal</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
                            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-primary">
                                <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium">Best Month</p>
                                <p className="text-gray-900 text-xl font-bold">{bestMonth}</p>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="col-span-2 flex items-center justify-between rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1">Remaining to Goal</p>
                                <p className="text-primary text-3xl font-bold">{(remaining / 1000).toFixed(1)}K cal</p>
                            </div>
                            <button
                                onClick={() => router.push('/record')}
                                className="rounded-full bg-primary/5 px-6 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                            >
                                Log Activity
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
