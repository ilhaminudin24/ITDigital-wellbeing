"use client";

interface LeaderboardEmptyProps {
    currentParticipants: number;
    minimumRequired: number;
}

/**
 * LeaderboardEmpty Component
 * Shown when minimum participants (3) not yet met
 */
export default function LeaderboardEmpty({
    currentParticipants,
    minimumRequired = 3,
}: LeaderboardEmptyProps) {
    const remaining = minimumRequired - currentParticipants;

    return (
        <div className="w-full px-4 py-8">
            <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl border border-gray-200 p-8">
                {/* Illustration */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-5xl">
                            groups
                        </span>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">🏆</span>
                    </div>
                    <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🔥</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-dark mb-2">
                    Waiting for Coworkers
                </h3>

                {/* Description */}
                <p className="text-text-muted text-sm max-w-xs mb-4">
                    The leaderboard will be available when at least{" "}
                    <span className="font-semibold text-primary">
                        {minimumRequired} coworkers
                    </span>{" "}
                    have completed their profiles.
                </p>

                {/* Progress */}
                <div className="w-full max-w-xs mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-muted">Progress</span>
                        <span className="font-medium text-text-dark">
                            {currentParticipants} / {minimumRequired}
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                            style={{
                                width: `${(currentParticipants / minimumRequired) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Remaining count */}
                <div className="bg-primary/5 rounded-lg px-4 py-3 border border-primary/20">
                    <p className="text-sm text-text-dark">
                        <span className="font-bold text-primary text-lg">
                            {remaining}
                        </span>{" "}
                        more {remaining === 1 ? "coworker" : "coworkers"} needed
                    </p>
                </div>

                {/* Encouragement */}
                <p className="text-xs text-text-muted mt-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Invite your teammates to join the challenge!
                </p>
            </div>
        </div>
    );
}
