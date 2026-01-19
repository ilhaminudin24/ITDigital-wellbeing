"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import {
    getUser,
    updateUserProfile,
    clearUser,
    clearActivities,
    calculateBMR,
    calculateYearlyTarget,
    TARGET_FORMULA_TOOLTIP,
    getMotivationText,
    User,
    initializeMockData,
} from "@/lib/userData";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailDigestEnabled, setEmailDigestEnabled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Edit form state
    const [editWeight, setEditWeight] = useState(70);
    const [editHeight, setEditHeight] = useState(170);
    const [editAge, setEditAge] = useState(30);
    const [editGender, setEditGender] = useState<'male' | 'female'>('male');

    useEffect(() => {
        initializeMockData();
        const userData = getUser();
        if (userData) {
            setUser(userData);
            setEditWeight(userData.weight);
            setEditHeight(userData.height);
            setEditAge(userData.age);
            setEditGender(userData.gender);
        }
    }, []);

    const handleSignOut = () => {
        clearUser();
        clearActivities();
        router.push('/');
    };

    const handleSaveProfile = () => {
        const updated = updateUserProfile({
            weight: editWeight,
            height: editHeight,
            age: editAge,
            gender: editGender,
        }, true);

        if (updated) {
            setUser(updated);
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        if (user) {
            setEditWeight(user.weight);
            setEditHeight(user.height);
            setEditAge(user.age);
            setEditGender(user.gender);
        }
        setIsEditing(false);
    };

    // Calculate progress
    const progressPercent = user
        ? Math.min(Math.round((user.totalCalories / user.targetCalories) * 100), 100)
        : 0;

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-6">
                    <div className="flex items-center gap-3">
                        <Logo size="md" />
                        <div className="flex flex-col">
                            <h1 className="text-primary text-xl font-bold leading-tight tracking-tight">Profile</h1>
                            <p className="text-text-muted text-sm font-medium">Manage your account</p>
                        </div>
                    </div>
                    <button className="relative w-10 h-10 overflow-hidden border border-gray-100 rounded-full shadow-sm">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHIWp0tJ-eM5yBvLQddeyk2iSsJhOh-tZ7oIj32PgT7TiAehP_s5Z3ntVQnCnQIiD8VyL96sK1qnbUVfdnS-1I4ASl-YClxJQQQPb8A82XtwzfY30hcLPmCo422PfTwyk0RnuHlY1MtNM3qVXnSd2hO-w4dZLrxscX1Bw-6KNHmk8zX5x-2IMIimkJyXejFZg8c0fvmPL-8dNWjx0vB-IME3aOyZ62LXVnbRDgPYaGtr-2LlmOuC0Eq3eNksGP1goER-EaKjSMdydE"
                            alt="User Profile"
                            fill
                            className="object-cover"
                        />
                    </button>
                </header>

                <main className="flex flex-col px-6 gap-6 w-full">
                    {/* Profile Card */}
                    <div className="relative flex flex-col items-center p-8 text-center overflow-hidden bg-white shadow-sm rounded-3xl border border-gray-100">
                        <div className="w-28 h-28 p-1.5 mb-4 bg-white rounded-full ring-2 ring-gray-50 shadow-sm relative">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhxuk_Sq3FnjsKChuJdtiXs91Qt-Tmzmdd5t-yl-Hzrp2haOrd4e9v7he5qbuAKaFNc-Y0iN81XvvwUncJEJSRfV1u9xaMuJQ8s6azb1EMvrOz8n8wTKtbQ3TPZnpOL_q9lfWhUSo_Xidt9xSlZfDPUTcF-czQldhXKMYrd_xlpo19qfAU0amd7Uqc-qJpJ8Q2pV0nHB1MRW37mTGwn4QMgekkIEx224Dc6RMK3TsSd0RAcG7vewEb-l-oa40elv9JM8Y4-CpnUe6t"
                                alt="Avatar"
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                        <h2 className="mb-1 text-2xl font-extrabold text-primary">{user?.name || 'Coworker'}</h2>
                        <p className="mb-5 font-medium text-gray-500">IT & Digital Team</p>
                        <div className="flex flex-wrap justify-center w-full gap-2">
                            <span className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm rounded-xl bg-accent text-primary">
                                {progressPercent >= 100 ? '🏆 GOAL ACHIEVED' : `${progressPercent}% COMPLETE`}
                            </span>
                            <span className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm rounded-xl bg-accent text-primary">
                                TOP 10%
                            </span>
                        </div>
                    </div>

                    {/* Body Profile Section */}
                    <div className="p-6 bg-white shadow-sm rounded-3xl border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-extrabold text-primary">Body Profile</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm font-bold text-primary hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="flex flex-col gap-4">
                                {/* Gender Selection */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditGender('male')}
                                        className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${editGender === 'male'
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-gray-50 text-slate-600'
                                            }`}
                                    >
                                        Male
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditGender('female')}
                                        className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${editGender === 'female'
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-gray-50 text-slate-600'
                                            }`}
                                    >
                                        Female
                                    </button>
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500">Weight</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={editWeight}
                                                onChange={(e) => setEditWeight(Number(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center text-sm focus:border-primary focus:outline-none"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500">Height</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={editHeight}
                                                onChange={(e) => setEditHeight(Number(e.target.value))}
                                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center text-sm focus:border-primary focus:outline-none"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500">Age</label>
                                        <input
                                            type="number"
                                            value={editAge}
                                            onChange={(e) => setEditAge(Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center text-sm focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex-1 py-2.5 rounded-xl bg-primary font-bold text-sm text-white hover:bg-[#004f93]"
                                    >
                                        Save & Recalculate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">
                                        {user?.gender === 'female' ? 'female' : 'male'}
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-400">Gender</p>
                                        <p className="font-bold text-gray-700 capitalize">{user?.gender || 'Male'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">monitor_weight</span>
                                    <div>
                                        <p className="text-xs text-gray-400">Weight</p>
                                        <p className="font-bold text-gray-700">{user?.weight || 70} kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">height</span>
                                    <div>
                                        <p className="text-xs text-gray-400">Height</p>
                                        <p className="font-bold text-gray-700">{user?.height || 170} cm</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">cake</span>
                                    <div>
                                        <p className="text-xs text-gray-400">Age</p>
                                        <p className="font-bold text-gray-700">{user?.age || 30} years</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Calorie Target Section */}
                    <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/20 rounded-3xl border border-primary/10 relative">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-1">Your Yearly Target</p>
                                <p className="text-3xl font-black text-primary">
                                    {(user?.targetCalories || 16439).toLocaleString()}
                                    <span className="text-lg font-bold text-primary/70 ml-1">cal</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    ~{Math.round((user?.targetCalories || 16439) / 52).toLocaleString()} cal/week
                                </p>
                            </div>
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-primary/10 transition-colors relative"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                onClick={() => setShowTooltip(!showTooltip)}
                            >
                                <span className="material-symbols-outlined text-primary">info</span>
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-sm font-bold text-primary/80">
                                {(user?.totalCalories || 0).toLocaleString()} cal achieved
                            </span>
                            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-white/50 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>

                        {/* Tooltip */}
                        {showTooltip && (
                            <div className="absolute left-4 right-4 top-full mt-2 bg-slate-800 text-white text-xs p-4 rounded-xl shadow-xl z-10">
                                <p className="font-bold mb-2">Bagaimana Target Dihitung?</p>
                                <p className="whitespace-pre-line leading-relaxed opacity-90">
                                    {TARGET_FORMULA_TOOLTIP}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Motivational Message */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 text-xl">emoji_events</span>
                        <div>
                            <p className="text-sm font-bold text-green-800 mb-1">💪 Target ini sangat achievable!</p>
                            <p className="text-xs text-green-700 leading-relaxed">
                                {user ? getMotivationText(Math.round((user.targetCalories || 16439) / 52), user.weight) : 'Hanya butuh beberapa menit jalan per minggu!'}
                            </p>
                        </div>
                    </div>

                    {/* Settings & Preferences */}
                    <div className="p-6 bg-white shadow-sm rounded-3xl border border-gray-100">
                        <h3 className="mb-4 text-lg font-extrabold text-primary">Settings & Preferences</h3>
                        <div className="flex flex-col gap-1">
                            {/* Notification */}
                            <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-blue-50 text-primary">
                                        <span className="text-[20px] material-symbols-outlined">notifications</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">Notifications</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            {/* Email Digest */}
                            <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-blue-50 text-primary">
                                        <span className="text-[20px] material-symbols-outlined">mark_email_unread</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">Email Digest</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={emailDigestEnabled}
                                        onChange={() => setEmailDigestEnabled(!emailDigestEnabled)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            {/* Help & Support */}
                            <button className="flex items-center justify-between w-full py-3 text-left transition-colors border-b border-gray-50 last:border-0 group">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex items-center justify-center w-9 h-9 transition-colors shrink-0 rounded-full bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white">
                                        <span className="text-[20px] material-symbols-outlined">help_outline</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">Help & Support</span>
                                </div>
                                <span className="text-xl text-gray-300 transition-colors material-symbols-outlined group-hover:text-primary">chevron_right</span>
                            </button>

                            {/* Privacy & Data */}
                            <button className="flex items-center justify-between w-full py-3 text-left transition-colors border-b border-gray-50 last:border-0 group">
                                <div className="flex items-center gap-3.5">
                                    <div className="flex items-center justify-center w-9 h-9 transition-colors shrink-0 rounded-full bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white">
                                        <span className="text-[20px] material-symbols-outlined">lock</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">Privacy & Data</span>
                                </div>
                                <span className="text-xl text-gray-300 transition-colors material-symbols-outlined group-hover:text-primary">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center w-full gap-2 px-4 py-4 mt-2 text-lg font-bold text-white transition-all shadow-lg rounded-2xl bg-primary hover:bg-blue-800 hover:shadow-xl group"
                    >
                        <span className="text-[24px] material-symbols-outlined">logout</span>
                        Sign Out
                    </button>

                    {/* Footer with Logo */}
                    <footer className="flex flex-col items-center gap-3 py-6 mt-4 mb-8">
                        <Logo size="sm" />
                        <p className="text-xs text-slate-400 text-center">
                            © IT & Digital Indonesia 2026
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
