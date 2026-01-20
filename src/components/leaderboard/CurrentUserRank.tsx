"use client";

import { LeaderboardEntry } from "@/lib/services/leaderboard.service";
import { leaderboardService } from "@/lib/services/leaderboard.service";

interface CurrentUserRankProps {
    entry: LeaderboardEntry;
    totalParticipants: number;
    nextRankEntry?: LeaderboardEntry | null;
}

/**
 * CurrentUserRank Component
 * Sticky section showing current user's position with motivation message
 */
export default function CurrentUserRank({
    entry,
    totalParticipants,
    nextRankEntry,
}: CurrentUserRankProps) {
    const formatCalories = (cal: number): string => {
        if (cal >= 1000) {
            return `${(cal / 1000).toFixed(1)}K`;
        }
        return cal.toLocaleString();
    };

    // Calculate progress percentage to target
    const progressPercentage = Math.min(
        (entry.total_calories / entry.target_calories) * 100,
        100
    );

    // Calculate calories needed to catch next rank
    const caloriesToCatch = nextRankEntry
        ? leaderboardService.getCaloriesToNextRank(
            entry.total_calories,
            nextRankEntry.total_calories
        )
        : 0;

    return (
        <div className="w-full px-4 pb-4">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20 p-3 shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-lg">
                        person
                    </span>
                    <span className="text-sm font-semibold text-primary">
                        Your Position
                    </span>
                    <span className="ml-auto text-xs text-text-muted">
                        {totalParticipants} coworkers
                    </span>
                </div>

                {/* Main Content */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary">
                            {entry.avatar_url ? (
                                <img
                                    src={entry.avatar_url}
                                    alt={entry.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-base">
                                    {entry.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Rank Badge */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {entry.rank}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-dark truncate">
                            {entry.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-orange-500 text-sm filled">
                                local_fire_department
                            </span>
                            <span className="font-bold text-primary text-base">
                                {formatCalories(entry.total_calories)}
                            </span>
                            <span className="text-text-muted text-sm">cal</span>
                        </div>
                    </div>

                    {/* Rank Display */}
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                            #{entry.rank}
                        </div>
                        <div className="text-xs text-text-muted">
                            of {totalParticipants}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-text-muted mb-1">
                        <span>Progress to target</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Motivation Message */}
                {nextRankEntry && caloriesToCatch > 0 && entry.rank > 1 && (
                    <div className="mt-3 flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-green-500 text-base">
                            trending_up
                        </span>
                        <span className="text-sm text-text-dark">
                            <span className="font-bold text-primary">
                                {formatCalories(caloriesToCatch)} cal
                            </span>{" "}
                            to catch{" "}
                            <span className="font-medium">
                                #{entry.rank - 1} {nextRankEntry.name.split(" ")[0]}
                            </span>
                        </span>
                    </div>
                )}

                {/* Champion Message */}
                {entry.rank === 1 && (
                    <div className="mt-3 flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200">
                        <span className="text-xl">🏆</span>
                        <span className="text-sm font-medium text-yellow-700">
                            You're the champion! Keep it up!
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
