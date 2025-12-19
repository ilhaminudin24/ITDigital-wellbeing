"use client";

import ProgressRing from "@/components/dashboard/ProgressRing";
import MonthlyStatus from "@/components/dashboard/MonthlyStatus";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">Halo, Ilham!</h2>
                        <p className="text-text-muted text-sm font-medium">Let's hit that 150km goal.</p>
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
                    <ProgressRing current={45.2} target={150} />

                    {/* Current Goal */}
                    <MonthlyStatus />

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
                            <h4 className="text-text-dark font-bold text-lg">Recent Walks</h4>
                            <button
                                onClick={() => router.push('/history')}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4 p-3 rounded-none bg-white border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">map</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-dark font-medium">IKEA → BSD Green Office</p>
                                    <p className="text-text-muted text-xs">Today, 08:30 AM</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-text-dark font-bold">2.4 km</p>
                                    <p className="text-primary text-xs">+300 pts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
