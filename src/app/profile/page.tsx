"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";
import { useActivities } from "@/lib/hooks/useActivities";
import { profileService } from "@/lib/services/profile.service";
import {
    TARGET_FORMULA_TOOLTIP,
    getMotivationText,
} from "@/lib/userData";

export default function Profile() {
    const router = useRouter();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const { user, isLoading: authLoading, signOut, changePassword } = useAuth();
    const { profile, isLoading: profileLoading, updateProfile, uploadAvatar, targets } = useProfile();
    const { yearlyCalories } = useActivities();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailDigestEnabled, setEmailDigestEnabled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Edit form state
    const [editWeight, setEditWeight] = useState(70);
    const [editHeight, setEditHeight] = useState(170);
    const [editAge, setEditAge] = useState(30);
    const [editGender, setEditGender] = useState<'male' | 'female'>('male');

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    // Initialize edit form with profile data
    useEffect(() => {
        if (profile) {
            setEditWeight(profile.weight);
            setEditHeight(profile.height);
            setEditAge(profile.age);
            setEditGender(profile.gender as 'male' | 'female');
        }
    }, [profile]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);

        // Calculate new target based on updated profile
        const newTargets = profileService.calculateAllTargets(
            editWeight,
            editHeight,
            editAge,
            editGender
        );

        const success = await updateProfile({
            weight: editWeight,
            height: editHeight,
            age: editAge,
            gender: editGender,
            target_calories: newTargets.yearlyTarget,
        });

        if (success) {
            setIsEditing(false);
        }
        setIsSaving(false);
    };

    const handleCancelEdit = () => {
        if (profile) {
            setEditWeight(profile.weight);
            setEditHeight(profile.height);
            setEditAge(profile.age);
            setEditGender(profile.gender as 'male' | 'female');
        }
        setIsEditing(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        await uploadAvatar(file);
        setIsUploadingAvatar(false);

        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleChangePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(false);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('Mohon isi semua field');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Password baru minimal 6 karakter');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Password baru tidak cocok');
            return;
        }

        setIsSavingPassword(true);
        const { success, errorMessage } = await changePassword(currentPassword, newPassword);
        setIsSavingPassword(false);

        if (success) {
            setPasswordSuccess(true);
            setPasswordError(null);
            // Auto-collapse after 2 seconds
            setTimeout(() => {
                setIsChangingPassword(false);
                setPasswordSuccess(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setShowCurrentPassword(false);
                setShowNewPassword(false);
            }, 2000);
        } else {
            setPasswordError(errorMessage || 'Gagal mengubah password');
        }
    };

    const handleCancelChangePassword = () => {
        setIsChangingPassword(false);
        setPasswordError(null);
        setPasswordSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
    };

    // Calculate progress
    const totalCalories = yearlyCalories || profile?.total_calories || 0;
    const targetCalories = profile?.target_calories || targets?.yearlyTarget || 127500;
    const progressPercent = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);

    if (authLoading || profileLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background-light gap-4">
                <div className="animate-pulse">
                    <Logo size="xl" />
                </div>
                <p className="text-sm text-slate-500 animate-pulse">Loading...</p>
            </div>
        );
    }

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
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="relative w-10 h-10 overflow-hidden border border-gray-100 rounded-full shadow-sm bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20"
                    >
                        <span className="material-symbols-outlined">home</span>
                    </button>
                </header>

                <main className="flex flex-col px-6 gap-6 w-full">
                    {/* Profile Card */}
                    <div className="relative flex flex-col items-center p-8 text-center overflow-hidden bg-white shadow-sm rounded-3xl border border-gray-100">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                        />

                        {/* Avatar with upload overlay */}
                        <button
                            onClick={handleAvatarClick}
                            disabled={isUploadingAvatar}
                            className="w-28 h-28 p-1.5 mb-4 bg-primary/10 rounded-full ring-2 ring-gray-50 shadow-sm relative flex items-center justify-center group cursor-pointer hover:ring-primary/30 transition-all overflow-hidden disabled:cursor-wait"
                        >
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover rounded-full"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-5xl text-primary">person</span>
                            )}

                            {/* Upload overlay */}
                            <div className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isUploadingAvatar ? (
                                    <span className="material-symbols-outlined text-2xl text-white animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-2xl text-white">photo_camera</span>
                                )}
                            </div>
                        </button>

                        <h2 className="mb-1 text-2xl font-extrabold text-primary">{profile?.name || 'Coworker'}</h2>

                        <p className="mb-5 font-medium text-gray-500">IT & Digital Team</p>
                        <div className="flex flex-wrap justify-center w-full gap-2">
                            <span className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm rounded-xl bg-accent text-primary">
                                {progressPercent >= 100 ? '🏆 GOAL ACHIEVED' : `${progressPercent}% COMPLETE`}
                            </span>
                            {profile?.nik && (
                                <span className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm rounded-xl bg-gray-100 text-gray-600">
                                    NIK: {profile.nik}
                                </span>
                            )}
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
                                        disabled={isSaving}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="flex-1 py-2.5 rounded-xl bg-primary font-bold text-sm text-white hover:bg-[#004f93] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save & Recalculate'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">
                                        {profile?.gender === 'female' ? 'female' : 'male'}
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-400">Gender</p>
                                        <p className="font-bold text-gray-700 capitalize">{profile?.gender || 'Male'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">monitor_weight</span>
                                    <div>
                                        <p className="text-xs text-gray-400">Weight</p>
                                        <p className="font-bold text-gray-700">{profile?.weight || 70} kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">height</span>
                                    <div>
                                        <p className="text-xs text-gray-400">Height</p>
                                        <p className="font-bold text-gray-700">{profile?.height || 170} cm</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-xl">cake</span>
                                    <div>
                                        <p className="text-xs text-gray-400">Age</p>
                                        <p className="font-bold text-gray-700">{profile?.age || 30} years</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Change Password Section */}
                    <div className="p-6 bg-white shadow-sm rounded-3xl border border-gray-100">
                        <button
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="flex items-center justify-between w-full"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">lock</span>
                                <h3 className="text-lg font-extrabold text-primary">Change Password</h3>
                            </div>
                            <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isChangingPassword ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {isChangingPassword && (
                            <div className="mt-5 flex flex-col gap-4">
                                {/* Success Message */}
                                {passwordSuccess && (
                                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Password berhasil diubah!
                                    </div>
                                )}

                                {/* Error Message */}
                                {passwordError && (
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">error</span>
                                        {passwordError}
                                    </div>
                                )}

                                {/* Current Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500">Password Lama</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Masukkan password lama"
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {showCurrentPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500">Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Minimal 6 karakter"
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {showNewPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Ulangi password baru"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>

                                {/* Validation Checklist */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                    <ul className="text-xs text-blue-700 space-y-1.5">
                                        <li className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[14px] ${newPassword.length >= 6 ? 'text-green-600' : 'text-blue-400'}`}>
                                                {newPassword.length >= 6 ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                            Minimal 6 karakter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[14px] ${newPassword === confirmNewPassword && confirmNewPassword.length > 0 ? 'text-green-600' : 'text-blue-400'}`}>
                                                {newPassword === confirmNewPassword && confirmNewPassword.length > 0 ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                            Password cocok
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-1">
                                    <button
                                        onClick={handleCancelChangePassword}
                                        disabled={isSavingPassword}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isSavingPassword || newPassword.length < 6 || newPassword !== confirmNewPassword || !currentPassword}
                                        className="flex-1 py-2.5 rounded-xl bg-primary font-bold text-sm text-white hover:bg-[#004f93] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSavingPassword ? (
                                            <>
                                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[16px]">lock</span>
                                                Save Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Motivational Message */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 text-xl">emoji_events</span>
                        <div>
                            <p className="text-sm font-bold text-green-800 mb-1">💪 Target ini sangat achievable!</p>
                            <p className="text-xs text-green-700 leading-relaxed">
                                {profile ? getMotivationText(Math.round(targetCalories / 52), profile.weight) : 'Hanya butuh beberapa menit jalan per minggu!'}
                            </p>
                        </div>
                    </div>
                    {/* Calorie Target Section */}
                    <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/20 rounded-3xl border border-primary/10 relative">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-1">Your Yearly Target</p>
                                <p className="text-3xl font-black text-primary">
                                    {targetCalories.toLocaleString()}
                                    <span className="text-lg font-bold text-primary/70 ml-1">cal</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    ~{Math.round(targetCalories / 52).toLocaleString()} cal/week
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
                                {totalCalories.toLocaleString()} cal achieved
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
