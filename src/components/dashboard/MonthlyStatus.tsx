"use client";

interface MonthlyStatusProps {
    currentCalories: number;
    targetCalories: number;
}

export default function MonthlyStatus({
    currentCalories = 0,
    targetCalories = 127500,
}: MonthlyStatusProps) {
    const monthlyTarget = Math.round(targetCalories / 12);
    const percentage = Math.min(Math.round((currentCalories / monthlyTarget) * 100), 100);

    // Get current month name
    const monthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-card-bg rounded-none p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Current Goal</p>
                    <h3 className="text-text-dark text-xl font-bold">{monthName}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    {percentage >= 100 ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold text-primary">
                        {currentCalories.toLocaleString()}
                        <span className="text-lg text-text-muted font-normal"> cal</span>
                    </span>
                    <span className="text-sm font-medium text-text-muted mb-1">
                        Target: {monthlyTarget.toLocaleString()} cal
                    </span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden p-1">
                    <div
                        className="h-full bg-accent rounded-full shadow-sm transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>0 cal</span>
                    <span>{percentage}% Done</span>
                </div>
            </div>
        </div>
    );
}
