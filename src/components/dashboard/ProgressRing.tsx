"use client";

interface ProgressRingProps {
    current: number;
    target: number;
}

export default function ProgressRing({
    current,
    target,
}: ProgressRingProps) {
    // Calculate percentage for the stroke-dasharray
    // The path length for radius 15.9155 is ~100.
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className="flex flex-col items-center justify-center bg-card-bg rounded-none p-8 shadow-sm border border-gray-200 relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative size-64 mb-4">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    {/* Background Circle */}
                    <path
                        className="text-gray-200"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                    ></path>
                    {/* Progress Circle */}
                    <path
                        className="text-primary drop-shadow-[0_0_4px_rgba(0,88,163,0.2)]"
                        strokeDasharray={`${percentage}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                    ></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-text-muted text-sm font-medium tracking-wider uppercase mb-1">Yearly Progress</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-primary tracking-tight">{current}</span>
                        <span className="text-lg font-medium text-text-muted">KM</span>
                    </div>
                    <div className="w-12 h-1 bg-accent rounded-full my-2"></div>
                    <span className="text-lg font-bold text-text-dark/80">/ {target} KM</span>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full border border-accent/40">
                <span className="material-symbols-outlined text-primary text-sm filled">bolt</span>
                <span className="text-primary font-bold text-sm">{Math.round((current / target) * 100)}% Complete</span>
            </div>
        </div>
    );
}
