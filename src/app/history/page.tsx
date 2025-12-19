"use client";

import React from "react";
import MonthSummary from "@/components/history/MonthSummary";
import ActivityList from "@/components/history/ActivityList";



export default function HistoryPage() {
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
                        totalDistance={8.2}
                        targetDistance={25}
                        month="Dec"
                    />
                    <ActivityList />
                </main>
            </div>
        </div>
    );
}
