"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/supabase/types";
import {
    calculateBMR,
    calculateYearlyTarget,
    TARGET_FORMULA_TOOLTIP,
    getMotivationText,
} from "@/lib/userData";

// Helper function to detect NIK vs Email
function isNIK(identifier: string): boolean {
    return /^\d+$/.test(identifier.trim());
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    // Multi-step form state: login -> reset-password (if first login) -> profile (if not completed)
    const [step, setStep] = useState<'login' | 'reset-password' | 'profile'>('login');

    // Login form state
    const [identifier, setIdentifier] = useState(''); // Can be NIK or Email
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Password reset form state (for first-time login)
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Profile form state
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [weight, setWeight] = useState<number>(70);
    const [height, setHeight] = useState<number>(170);
    const [age, setAge] = useState<number>(30);
    const [profileNIK, setProfileNIK] = useState('');
    const [targetPreview, setTargetPreview] = useState<number>(0);
    const [showTooltip, setShowTooltip] = useState(false);

    // Check for error in URL params
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'auth_callback_error') {
            setError('Terjadi kesalahan saat autentikasi. Silakan coba lagi.');
        }
    }, [searchParams]);

    // Check if user is already authenticated
    useEffect(() => {
        const checkSession = async () => {
            try {
                // First check local session (fast, no network call)
                const { data: { session } } = await supabase.auth.getSession();

                // If no session, user is not logged in - stay on login page
                if (!session?.user) {
                    return;
                }

                // Only make network call if we have a session
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (profile?.profile_completed && profile?.password_changed) {
                    router.push('/dashboard');
                } else if (profile) {
                    // Pre-fill from existing profile
                    setProfileNIK(profile.nik || '');
                    setName(profile.name || '');
                    if (profile.weight) setWeight(profile.weight);
                    if (profile.height) setHeight(profile.height);
                    if (profile.age) setAge(profile.age);
                    if (profile.gender) setGender(profile.gender as 'male' | 'female');

                    // Check what step to show
                    if (!profile.password_changed) {
                        setStep('reset-password');
                    } else {
                        setStep('profile');
                    }
                } else if (session.user.email) {
                    // Fallback: extract name from email
                    const extractedName = session.user.email.split('@')[0];
                    setName(extractedName.charAt(0).toUpperCase() + extractedName.slice(1));
                    setStep('profile');
                }
            } catch (error) {
                // Silently handle errors - user can still login manually
                console.warn('Session check failed:', error);
            }
        };
        checkSession();
    }, [router, supabase]);

    // Handle Login with NIK or Email
    const handleLogin = async () => {
        if (!identifier || !password) {
            setError('Mohon isi semua field');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let email = identifier;

            // If identifier is NIK, lookup the email from user_profiles
            if (isNIK(identifier)) {
                const { data: profile, error: lookupError } = await supabase
                    .from('user_profiles')
                    .select('email')
                    .eq('nik', identifier.trim())
                    .single();

                if (lookupError || !profile || !profile.email) {
                    setError('NIK tidak ditemukan. Pastikan NIK sudah terdaftar atau gunakan email.');
                    setIsLoading(false);
                    return;
                }

                // Use the email from profile for login
                email = profile.email;
            }

            // Sign in with email and password
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes('Invalid login credentials')) {
                    setError('Email atau password salah');
                } else if (signInError.message.includes('Email not confirmed')) {
                    setError('Email belum dikonfirmasi. Cek inbox Anda.');
                } else {
                    setError(signInError.message);
                }
                setIsLoading(false);
                return;
            }

            if (data.user) {
                // Check if profile exists and check password_changed status
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', data.user.id)
                    .single();

                if (profile) {
                    // Pre-fill profile data
                    setProfileNIK(profile.nik || '');
                    setName(profile.name || '');
                    if (profile.weight) setWeight(profile.weight);
                    if (profile.height) setHeight(profile.height);
                    if (profile.age) setAge(profile.age);
                    if (profile.gender) setGender(profile.gender as 'male' | 'female');

                    // Check if password needs to be changed (first-time login)
                    if (!profile.password_changed) {
                        setStep('reset-password');
                        return;
                    }

                    // Check if profile is complete
                    if (profile.profile_completed) {
                        // Redirect to dashboard
                        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
                        router.push(redirectTo);
                    } else {
                        // Show profile setup
                        setStep('profile');
                    }
                } else {
                    // No profile exists - extract name from email and show profile setup
                    const extractedName = email.split('@')[0];
                    setName(extractedName.charAt(0).toUpperCase() + extractedName.slice(1));
                    setStep('profile');
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Password Reset (for first-time login)
    const handlePasswordReset = async () => {
        if (!newPassword || !confirmNewPassword) {
            setError('Mohon isi semua field');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Password tidak cocok');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Sesi tidak valid. Silakan login ulang.');
                setStep('login');
                setIsLoading(false);
                return;
            }

            // Update password in Supabase Auth
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                setError('Gagal mengubah password: ' + updateError.message);
                setIsLoading(false);
                return;
            }

            // Mark password as changed in user_profiles
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({ password_changed: true })
                .eq('user_id', user.id);

            if (profileError) {
                console.error('Profile update error:', profileError);
                // Continue anyway - password is already changed
            }

            // Check if profile is complete
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setSuccessMessage('Password berhasil diubah!');

            if (profile?.profile_completed) {
                // Redirect to dashboard
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                // Show profile setup
                setTimeout(() => {
                    setSuccessMessage(null);
                    setStep('profile');
                }, 1000);
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Calculate BMR
    const handleCalculate = () => {
        const bmr = calculateBMR(weight, height, age, gender);
        setTargetPreview(calculateYearlyTarget(bmr));
    };

    // Handle Start Journey (Create Profile)
    const handleStartJourney = async () => {
        if (targetPreview === 0) {
            handleCalculate();
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Sesi tidak valid. Silakan login ulang.');
                setStep('login');
                setIsLoading(false);
                return;
            }

            const bmr = calculateBMR(weight, height, age, gender);
            const yearlyTarget = calculateYearlyTarget(bmr);

            // Create or update profile in Supabase
            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert({
                    user_id: user.id,
                    nik: profileNIK || null,
                    name: name || 'Coworker',
                    weight,
                    height,
                    age,
                    gender,
                    target_calories: yearlyTarget,
                    total_calories: 0,
                    profile_completed: true,
                }, {
                    onConflict: 'user_id',
                });

            if (profileError) {
                console.error('Profile error:', profileError);
                setError('Gagal menyimpan profil. Silakan coba lagi.');
                setIsLoading(false);
                return;
            }

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-calculate when profile fields change
    useEffect(() => {
        if (step === 'profile') {
            handleCalculate();
        }
    }, [weight, height, age, gender, step]);

    // Render Password Reset Step (for first-time login)
    if (step === 'reset-password') {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light text-slate-900 font-display">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:px-10">
                    <Logo size="md" withText />
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col items-center justify-center p-4 lg:p-8">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                        <div className="mb-6 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
                                <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                                First Time Login
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">
                                Set Your Password
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Untuk keamanan akun, silakan buat password baru Anda.
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                {successMessage}
                            </div>
                        )}

                        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
                            {/* New Password Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Password Baru <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimal 6 karakter"
                                        minLength={6}
                                        required
                                    />
                                    <span
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-slate-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Konfirmasi Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Ulangi password baru"
                                    required
                                />
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-xs font-semibold text-blue-800 mb-2">Password harus memenuhi:</p>
                                <ul className="text-xs text-blue-700 space-y-1">
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || newPassword.length < 6 || newPassword !== confirmNewPassword}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-[#004f93] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                        MENYIMPAN...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">lock</span>
                                        SET PASSWORD
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <footer className="mt-8 text-center text-xs text-slate-400">
                        © IKEA IT & Digital Indonesia 2026. All rights reserved.
                    </footer>
                </main>
            </div>
        );
    }

    // Render Profile Step
    if (step === 'profile') {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light text-slate-900 font-display">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:px-10">
                    <Logo size="md" withText />
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col items-center justify-center p-4 lg:p-8">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                        <div className="mb-6 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                <span className="material-symbols-outlined text-[16px]">person</span>
                                Profile Setup
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">
                                Complete Your Profile
                            </h2>
                            <p className="text-slate-500 text-sm">
                                We need a few details to calculate your personal calorie target.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-5">
                            {/* Name Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Your Name
                                </label>
                                <input
                                    className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* NIK Display (Read-only if already set from registration) */}
                            {profileNIK ? (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        NIK (Coworker ID) <span className="text-green-600 font-normal">✓ Tersimpan</span>
                                    </label>
                                    <div className="w-full rounded-full border border-green-300 bg-green-50 px-5 py-3 text-base text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-[18px]">badge</span>
                                        {profileNIK}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        NIK (Coworker ID) <span className="text-slate-400 font-normal">- opsional</span>
                                    </label>
                                    <input
                                        className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        type="text"
                                        value={profileNIK}
                                        onChange={(e) => setProfileNIK(e.target.value)}
                                        placeholder="12345678"
                                    />
                                </div>
                            )}

                            {/* Gender Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Gender
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setGender('male')}
                                        className={`flex-1 py-3 rounded-full border-2 font-bold transition-all ${gender === 'male'
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-gray-50 text-slate-600 hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px] mr-1 align-middle">male</span>
                                        Male
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGender('female')}
                                        className={`flex-1 py-3 rounded-full border-2 font-bold transition-all ${gender === 'female'
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-200 bg-gray-50 text-slate-600 hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px] mr-1 align-middle">female</span>
                                        Female
                                    </button>
                                </div>
                            </div>

                            {/* Weight, Height, Age Inputs */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Weight
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-slate-900 text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(Number(e.target.value))}
                                            min={30}
                                            max={200}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                                            kg
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Height
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-slate-900 text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(Number(e.target.value))}
                                            min={100}
                                            max={250}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                                            cm
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Age
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-slate-900 text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(Number(e.target.value))}
                                        min={18}
                                        max={80}
                                    />
                                </div>
                            </div>

                            {/* Target Preview with Tooltip */}
                            <div className="relative bg-gradient-to-r from-primary/5 to-accent/20 rounded-2xl p-5 border border-primary/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-1">
                                            Your Yearly Target
                                        </p>
                                        <p className="text-3xl font-black text-primary">
                                            {targetPreview.toLocaleString()}
                                            <span className="text-lg font-bold text-primary/70 ml-1">cal</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            ~{Math.round(targetPreview / 52).toLocaleString()} cal/week • ~{Math.round(targetPreview / 12).toLocaleString()} cal/month
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative p-2 rounded-full hover:bg-primary/10 transition-colors"
                                        onMouseEnter={() => setShowTooltip(true)}
                                        onMouseLeave={() => setShowTooltip(false)}
                                        onClick={() => setShowTooltip(!showTooltip)}
                                    >
                                        <span className="material-symbols-outlined text-primary">info</span>
                                    </button>
                                </div>

                                {/* Tooltip */}
                                {showTooltip && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800 text-white text-xs p-4 rounded-xl shadow-xl z-10">
                                        <p className="font-bold mb-2">Bagaimana Target Dihitung?</p>
                                        <p className="whitespace-pre-line leading-relaxed opacity-90">
                                            {TARGET_FORMULA_TOOLTIP}
                                        </p>
                                        <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-slate-800"></div>
                                    </div>
                                )}
                            </div>

                            {/* Motivational Message */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-600 text-xl">emoji_events</span>
                                <div>
                                    <p className="text-sm font-bold text-green-800 mb-1">💪 Target ini sangat achievable!</p>
                                    <p className="text-xs text-green-700 leading-relaxed">
                                        {getMotivationText(Math.round(targetPreview / 52), weight)}
                                    </p>
                                </div>
                            </div>

                            {/* Start Journey Button */}
                            <button
                                type="button"
                                onClick={handleStartJourney}
                                disabled={isLoading}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-[#004f93] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                        SAVING...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px] text-accent">directions_walk</span>
                                        START MY JOURNEY
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <footer className="mt-8 text-center text-xs text-slate-400">
                        © IKEA IT & Digital Indonesia 2026. All rights reserved.
                    </footer>
                </main>
            </div>
        );
    }

    // Render Login Step (Default)
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light text-slate-900 font-display">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:px-10">
                <Logo size="md" withText />
                <button className="hidden sm:flex group cursor-pointer items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20 hover:text-primary">
                    <span className="material-symbols-outlined text-[20px] text-primary">
                        help
                    </span>
                    <span>Need Help?</span>
                </button>
                <button className="flex sm:hidden size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[24px]">help</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center p-4 lg:p-8">
                <div className="flex w-full max-w-[1000px] flex-col overflow-hidden rounded-3xl bg-white shadow-xl lg:flex-row lg:border lg:border-gray-200">

                    {/* Left Panel (Visual) */}
                    <div className="relative flex flex-col justify-between bg-white p-8 lg:w-1/2 lg:p-12 lg:border-r lg:border-gray-100">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2670&auto=format&fit=crop"
                                alt="Abstract walking trail in nature forest"
                                fill
                                className="object-cover opacity-5"
                                priority
                            />
                        </div>

                        <div className="relative z-10">
                            {/* Logo in Hero */}
                            <div className="mb-6">
                                <Logo size="3xl" />
                            </div>

                            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-slate-900 lg:text-5xl">
                                IT & Digital <br />
                                <span className="text-primary">Wellbeing MOnitor</span>
                            </h1>

                        </div>


                    </div>

                    {/* Right Panel (Form) */}
                    <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-primary">
                                Welcome Back!
                            </h2>
                            <p className="mt-2 text-slate-500">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                {successMessage}
                            </div>
                        )}

                        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-semibold text-slate-700"
                                    htmlFor="username"
                                >
                                    Coworker ID / Email
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3.5 text-base text-slate-900 placeholder-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        id="username"
                                        autoComplete="username"
                                        type="text"
                                        placeholder="Enter your ID or Email"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-primary">
                                        <span className="material-symbols-outlined text-[20px]">
                                            person
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-semibold text-slate-700"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3.5 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        id="password"
                                        autoComplete="current-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-slate-600 peer-focus:text-primary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    className="text-sm font-medium text-slate-500 transition-colors hover:text-primary"
                                    href="#"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-[#004f93] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                        LOGGING IN...
                                    </>
                                ) : (
                                    <>
                                        LOGIN
                                        <span className="material-symbols-outlined text-[20px]">
                                            arrow_forward
                                        </span>
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex flex-col items-center gap-4 text-center">
                                <p className="text-xs text-slate-500">
                                    Belum punya akun? Hubungi admin IT untuk mendapatkan akses.
                                </p>
                                <p className="text-xs text-slate-400">
                                    By logging in, you agree to the{" "}
                                    <Link className="underline hover:text-primary" href="#">
                                        Terms of Service
                                    </Link>{" "}
                                    &{" "}
                                    <Link className="underline hover:text-primary" href="#">
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                <footer className="mt-8 text-center text-xs text-slate-400">
                    © IKEA IT & Digital Indonesia 2026. All rights reserved.
                </footer>
            </main>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
