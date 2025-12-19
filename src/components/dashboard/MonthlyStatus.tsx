export default function MonthlyStatus() {
    const current = 8.2;
    const target = 12.5;
    const percentage = Math.round((current / target) * 100);

    return (
        <div className="bg-card-bg rounded-none p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-text-muted text-xs font-bold tracking-wider uppercase mb-1">Current Goal</p>
                    <h3 className="text-text-dark text-xl font-bold">December 2024</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    IN PROGRESS
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold text-primary">{current}<span className="text-lg text-text-muted font-normal">km</span></span>
                    <span className="text-sm font-medium text-text-muted mb-1">Target: {target}km</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden p-1">
                    <div className="h-full bg-accent rounded-full shadow-sm" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>0km</span>
                    <span>{percentage}% Done</span>
                </div>
            </div>
        </div>
    );
}
