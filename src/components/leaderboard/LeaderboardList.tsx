"use client";

import { LeaderboardEntry } from "@/lib/services/leaderboard.service";

interface LeaderboardListProps {
    entries: LeaderboardEntry[];
    currentUserId?: string;
    onUserClick?: (entry: LeaderboardEntry) => void;
}

/**
 * LeaderboardList Component
 * Displays rank #4 and below in compact list format (NO avatars per user request)
 */
export default function LeaderboardList({
    entries,
    currentUserId,
    onUserClick,
}: LeaderboardListProps) {
    if (entries.length === 0) return null;

    const formatCalories = (cal: number): string => {
        if (cal >= 1000) {
            return `${(cal / 1000).toFixed(1)}K`;
        }
        return cal.toLocaleString();
    };

    return (
        <div className="w-full px-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {entries.map((entry, index) => {
                    const isCurrentUser = entry.user_id === currentUserId;

                    return (
                        <div
                            key={entry.user_id}
                            onClick={() => onUserClick?.(entry)}
                            className={`flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 transition-all duration-300 cursor-pointer ${isCurrentUser
                                ? "bg-primary/5 border-l-4 border-l-primary"
                                : "hover:bg-gray-50 active:bg-gray-100"
                                }`}
                            style={{
                                animationDelay: `${(index + 3) * 0.05}s`,
                            }}
                        >
                            {/* Rank Badge */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isCurrentUser
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-text-dark"
                                }`}>
                                <span className="text-sm font-bold">{entry.rank}</span>
                            </div>

                            {/* Fire Icon */}
                            <span className="material-symbols-outlined text-orange-500 text-lg mr-2 filled">
                                local_fire_department
                            </span>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${isCurrentUser ? "text-primary" : "text-text-dark"
                                    }`}>
                                    {entry.name}
                                    {isCurrentUser && (
                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            You
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Calories */}
                            <div className="flex items-center gap-1 ml-2">
                                <span className={`font-bold ${isCurrentUser ? "text-primary" : "text-text-dark"
                                    }`}>
                                    {formatCalories(entry.total_calories)}
                                </span>
                                <span className="text-text-muted text-sm">cal</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
