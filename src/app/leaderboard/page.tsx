"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import {
    LeaderboardPodium,
    LeaderboardList,
    CurrentUserRank,
    LeaderboardEmpty,
    UserDetailSheet,
} from "@/components/leaderboard";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { LeaderboardEntry } from "@/lib/services/leaderboard.service";

export default function LeaderboardPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const {
        leaderboard,
        isLoading: leaderboardLoading,
        error,
        hasMinimumParticipants,
    } = useLeaderboard();

    const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleUserClick = (user: LeaderboardEntry) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    const isLoading = authLoading || leaderboardLoading;

    // Loading state
    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background-light gap-4">
                <div className="animate-pulse">
                    <Logo size="xl" />
                </div>
                <p className="text-sm text-slate-500 animate-pulse">
                    Loading leaderboard...
                </p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background-light gap-4 px-6">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-red-400 mb-4">
                        error
                    </span>
                    <h2 className="text-xl font-bold text-text-dark mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-text-muted text-sm mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🏆</span>
                        <div className="flex flex-col">
                            <h1 className="text-primary text-xl font-bold leading-tight tracking-tight">
                                Leaderboard
                            </h1>
                            <p className="text-text-muted text-sm font-medium">
                                IT & Digital Wellbeing Ranking
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push("/profile")}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-primary"
                    >
                        <span className="material-symbols-outlined">
                            account_circle
                        </span>
                    </button>
                </header>

                <main className="flex flex-col gap-4 w-full flex-grow">
                    {/* Empty State - Less than 3 participants */}
                    {!hasMinimumParticipants && (
                        <LeaderboardEmpty
                            currentParticipants={
                                leaderboard?.totalParticipants || 0
                            }
                            minimumRequired={3}
                        />
                    )}

                    {/* Main Leaderboard Content */}
                    {hasMinimumParticipants && leaderboard && (
                        <>
                            {/* Podium - Top 3 with avatars */}
                            <LeaderboardPodium
                                topThree={leaderboard.topThree}
                                currentUserId={user.id}
                                onUserClick={handleUserClick}
                            />

                            {/* Divider */}
                            {leaderboard.restOfList.length > 0 && (
                                <div className="px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                        <span className="text-xs text-text-muted font-medium">
                                            More Rankings
                                        </span>
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                    </div>
                                </div>
                            )}

                            {/* List - #4 and below */}
                            <LeaderboardList
                                entries={leaderboard.restOfList}
                                currentUserId={user.id}
                                onUserClick={handleUserClick}
                            />

                            {/* Current User Rank - Inline in content flow */}
                            {leaderboard.currentUserEntry && (
                                <CurrentUserRank
                                    entry={leaderboard.currentUserEntry}
                                    totalParticipants={
                                        leaderboard.totalParticipants
                                    }
                                    nextRankEntry={leaderboard.nextRankEntry}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* User Detail Sheet */}
            <UserDetailSheet
                userId={selectedUser?.user_id || null}
                userInfo={selectedUser}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
        </div>
    );
}
