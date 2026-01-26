"use client";

import { LeaderboardEntry } from "@/lib/services/leaderboard.service";

interface LeaderboardPodiumProps {
    topThree: LeaderboardEntry[];
    currentUserId?: string;
    onUserClick?: (entry: LeaderboardEntry) => void;
}

/**
 * LeaderboardPodium Component
 * Displays top 3 users in podium-style layout with avatars
 * Order: 2nd | 1st | 3rd (classic podium arrangement)
 */
export default function LeaderboardPodium({
    topThree,
    currentUserId,
    onUserClick,
}: LeaderboardPodiumProps) {
    if (topThree.length === 0) return null;

    // Reorder for podium display: [2nd, 1st, 3rd]
    const podiumOrder = [
        topThree[1], // 2nd place (left)
        topThree[0], // 1st place (center, tallest)
        topThree[2], // 3rd place (right)
    ].filter(Boolean);

    const getMedalIcon = (rank: number): string => {
        switch (rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return "";
        }
    };

    const getMedalColor = (rank: number): string => {
        switch (rank) {
            case 1: return "from-yellow-400 to-yellow-600"; // Gold
            case 2: return "from-gray-300 to-gray-500"; // Silver
            case 3: return "from-orange-400 to-orange-600"; // Bronze
            default: return "from-primary to-primary";
        }
    };

    const getMedalBgColor = (rank: number): string => {
        switch (rank) {
            case 1: return "bg-yellow-50 border-yellow-300";
            case 2: return "bg-gray-50 border-gray-300";
            case 3: return "bg-orange-50 border-orange-300";
            default: return "bg-white border-gray-200";
        }
    };

    const getPodiumHeight = (rank: number): string => {
        switch (rank) {
            case 1: return "h-16"; // Tallest - reduced for mobile
            case 2: return "h-12";
            case 3: return "h-10";
            default: return "h-10";
        }
    };

    const formatCalories = (cal: number): string => {
        if (cal >= 1000) {
            return `${(cal / 1000).toFixed(1)}K`;
        }
        return cal.toLocaleString();
    };

    return (
        <div className="w-full px-2 py-4">
            <div className="flex items-end justify-center gap-2">
                {podiumOrder.map((entry, index) => {
                    if (!entry) return null;
                    const isCurrentUser = entry.user_id === currentUserId;
                    const actualRank = entry.rank;

                    return (
                        <div
                            key={entry.user_id}
                            onClick={() => onUserClick?.(entry)}
                            className={`flex flex-col items-center transition-all duration-500 cursor-pointer hover:scale-105 ${actualRank === 1 ? "order-2" : actualRank === 2 ? "order-1" : "order-3"
                                }`}
                            style={{
                                animationDelay: `${index * 0.1}s`,
                            }}
                        >
                            {/* Avatar & Medal */}
                            <div className="relative mb-2">
                                {/* Medal Badge */}
                                <div className="absolute -top-2 -right-2 text-2xl z-10">
                                    {getMedalIcon(actualRank)}
                                </div>

                                {/* Avatar */}
                                <div
                                    className={`relative rounded-full overflow-hidden border-4 ${isCurrentUser
                                        ? "border-primary ring-2 ring-primary/30"
                                        : actualRank === 1
                                            ? "border-yellow-400"
                                            : actualRank === 2
                                                ? "border-gray-400"
                                                : "border-orange-400"
                                        } ${actualRank === 1 ? "w-16 h-16" : "w-12 h-12"}`}
                                >
                                    {entry.avatar_url ? (
                                        <img
                                            src={entry.avatar_url}
                                            alt={entry.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getMedalColor(actualRank)} text-white font-bold text-xl`}>
                                            {entry.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <p className={`font-semibold text-center text-sm max-w-20 truncate ${isCurrentUser ? "text-primary" : "text-text-dark"
                                }`}>
                                {entry.name.split(" ")[0]}
                            </p>

                            {/* Calories */}
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-orange-500 text-sm filled">
                                    local_fire_department
                                </span>
                                <span className="text-xs font-bold text-text-dark">
                                    {formatCalories(entry.total_calories)}
                                </span>
                            </div>

                            {/* Podium Block */}
                            <div
                                className={`mt-2 w-16 ${getPodiumHeight(actualRank)} ${getMedalBgColor(actualRank)} border-2 rounded-t-lg flex items-center justify-center transition-all duration-300`}
                            >
                                <span className={`text-lg font-bold ${actualRank === 1 ? "text-yellow-600" :
                                    actualRank === 2 ? "text-gray-600" :
                                        "text-orange-600"
                                    }`}>
                                    #{actualRank}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
