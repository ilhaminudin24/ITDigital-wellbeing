"use client";

import React from "react";



import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function ReportPage() {
    const router = useRouter();
    const [year, setYear] = React.useState(2024);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = React.useState(false);

    // Mock Data
    const data2024 = {
        total: 85,
        percent: 56,
        avg: 12.1,
        bestMonth: "March",
        remaining: 65,
        chartHeight: ["40%", "45%", "85%", "50%", "40%", "65%"]
    };

    const data2023 = {
        total: 120,
        percent: 80,
        avg: 10.0,
        bestMonth: "Sept",
        remaining: 0,
        chartHeight: ["60%", "55%", "40%", "70%", "80%", "75%"]
    };

    const currentData = year === 2024 ? data2024 : data2023;

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                {/* Standard Header - Fixed Height for Consistency */}
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">
                            Progress Report
                        </h2>
                        {/* Invisible placeholder to match Dashboard/History header height */}
                        <p className="text-transparent text-sm font-medium select-none">Placeholder</p>
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
                                {[2024, 2023].map((y) => (
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

                    {/* Yearly Goal Section - White Card */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-3xl">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Yearly Goal</p>
                        <div className="flex items-end justify-between mb-4">
                            <div className="flex items-baseline">
                                <span className="text-[42px] font-bold text-primary leading-none">{currentData.total}</span>
                                <span className="text-xl text-gray-400 font-semibold ml-1">km</span>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold text-lg">{currentData.percent}%</p>
                                <p className="text-gray-400 text-xs">of 150km Target</p>
                            </div>
                        </div>

                        {/* Linear Progress Bar */}
                        <div className="h-4 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-accent relative shadow-[0_0_10px_rgba(255,219,0,0.4)] transition-all duration-1000 ease-out"
                                style={{ width: `${currentData.percent}%` }}
                            >
                                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,.5)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.5)_50%,rgba(255,255,255,.5)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Distance Card - White Card */}
                    <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Monthly Distance</h3>
                                <p className="text-gray-400 text-sm">Jan - Dec {year}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">bar_chart</span>
                            </div>
                        </div>

                        <div className="grid min-h-[160px] grid-cols-7 items-end gap-2 sm:gap-3">
                            {/* Bars (Mock based on chartHeight array) */}
                            {["J", "F", "M", "A", "M", "J"].map((label, idx) => (
                                <div key={idx} className="group flex flex-col items-center gap-2">
                                    <div
                                        className={clsx(
                                            "w-full rounded-t-lg transition-all duration-700 ease-out",
                                            idx === 2 ? "bg-accent shadow-sm" : "bg-primary/20 group-hover:bg-primary"
                                        )}
                                        style={{ height: currentData.chartHeight[0] ? currentData.chartHeight[idx] : "10%" }}
                                    ></div>
                                    <span className={clsx("text-xs font-bold", idx === 2 ? "text-primary" : "text-gray-400")}>{label}</span>
                                </div>
                            ))}

                            {/* Jul (Empty/Placeholder) */}
                            <div className="group flex flex-col items-center gap-2">
                                <div className="w-full rounded-t-lg bg-gray-100" style={{ height: "5%" }}></div>
                                <span className="text-xs font-bold text-gray-300">J</span>
                            </div>
                        </div>
                    </div>

                    {/* Cumulative Line Chart - White Card */}
                    <div className="bg-white border border-gray-200 p-6 pb-2 shadow-sm rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Cumulative</h3>
                                <p className="text-gray-400 text-sm">vs. Target Pace</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">show_chart</span>
                            </div>
                        </div>

                        <div className="relative h-[160px] w-full mb-6">
                            {/* Target Line */}
                            <div className="absolute top-[20%] left-0 right-0 border-t border-dashed border-gray-300"></div>
                            <p className="absolute right-0 top-[8%] text-[10px] text-gray-400 bg-white px-1">150km Target</p>

                            {/* SVG Chart */}
                            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 150">
                                <defs>
                                    <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#0058a3" stopOpacity="0.1"></stop>
                                        <stop offset="100%" stopColor="#0058a3" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 L0,120 C40,110 60,115 100,80 C140,45 180,60 220,50 L220,150 Z" fill="url(#gradientArea)"></path>
                                <path d="M0,120 C40,110 60,115 100,80 C140,45 180,60 220,50" fill="none" stroke="#0058a3" strokeLinecap="round" strokeWidth="3"></path>
                                <circle cx="220" cy="50" fill="#FFDA1A" r="6" stroke="#0058a3" strokeWidth="2"></circle>
                            </svg>

                            {/* X Axis Labels */}
                            <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between px-2 text-[10px] text-gray-400 font-bold uppercase">
                                <span>Jan</span>
                                <span>Jun</span>
                                <span>Dec</span>
                            </div>
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
                                <p className="text-gray-900 text-xl font-bold">{currentData.avg} km</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
                            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-primary">
                                <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium">Best Month</p>
                                <p className="text-gray-900 text-xl font-bold">{currentData.bestMonth}</p>
                            </div>
                        </div>

                        {/* CTA Card - Redesigned to White Card */}
                        <div className="col-span-2 flex items-center justify-between rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1">Remaining to Goal</p>
                                <p className="text-primary text-3xl font-bold">{currentData.remaining} km</p>
                            </div>
                            <button
                                onClick={() => router.push('/record')}
                                className="rounded-full bg-primary/5 px-6 py-3 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                            >
                                Log Walk
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
