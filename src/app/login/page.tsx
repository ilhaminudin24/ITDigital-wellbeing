"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import {
    getUser,
    createUser,
    calculateBMR,
    calculateYearlyTarget,
    calculateWeeklyTarget,
    TARGET_FORMULA_TOOLTIP,
    getMotivationText,
} from "@/lib/userData";

export default function LoginPage() {
    const router = useRouter();

    // Multi-step form state
    const [step, setStep] = useState<'login' | 'profile'>('login');

    // Login form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Profile form state
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [weight, setWeight] = useState<number>(70);
    const [height, setHeight] = useState<number>(170);
    const [age, setAge] = useState<number>(30);
    const [targetPreview, setTargetPreview] = useState<number>(0);
    const [showTooltip, setShowTooltip] = useState(false);

    // Check if user already has a completed profile
    useEffect(() => {
        const user = getUser();
        if (user?.profileCompleted) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleLogin = () => {
        // For now, we just proceed to profile step or dashboard
        const user = getUser();
        if (user?.profileCompleted) {
            router.push('/dashboard');
        } else {
            // Extract name from email for convenience
            const extractedName = email.split('@')[0];
            setName(extractedName.charAt(0).toUpperCase() + extractedName.slice(1));
            setStep('profile');
        }
    };

    const handleCalculate = () => {
        const bmr = calculateBMR(weight, height, age, gender);
        setTargetPreview(calculateYearlyTarget(bmr));
    };

    const handleStartJourney = () => {
        if (targetPreview === 0) {
            handleCalculate();
        }

        // Create user with profile data
        createUser({
            name: name || 'Coworker',
            email: email || 'coworker@ikea.com',
            weight,
            height,
            age,
            gender,
        });

        router.push('/dashboard');
    };

    // Auto-calculate when profile fields change
    useEffect(() => {
        if (step === 'profile') {
            handleCalculate();
        }
    }, [weight, height, age, gender, step]);

    // Render Profile Step
    if (step === 'profile') {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light text-slate-900 font-display">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:px-10">
                    <Logo size="md" withText />
                    <button
                        onClick={() => setStep('login')}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Back
                    </button>
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
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-[#004f93] active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-[20px] text-accent">directions_walk</span>
                                START MY JOURNEY
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

    // Render Login Step (Original)
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
                                <Logo size="xl" />
                            </div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                <span className="material-symbols-outlined text-[16px]">
                                    directions_walk
                                </span>
                                Challenge 2026
                            </div>
                            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-slate-900 lg:text-5xl">
                                Track your <br />
                                <span className="text-primary">calorie journey</span>
                            </h1>
                            <p className="text-lg text-slate-600">
                                Join the challenge and monitor your walking activity with IKEA IT
                                & Digital. Every step counts towards a healthier you.
                            </p>
                        </div>

                        <div className="relative z-10 mt-12 hidden lg:block">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4 rtl:space-x-reverse">
                                    {[
                                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMhaGUAz-tWFksLVG0HiHBaGEjPF4XGrkJM8zfH6q7RASCu0tpR80mcdotElHExfAlxBZuYvdkaYAnL4cDQSVCp9BSUss4pfh4Pd7ZIh5Nrppk2SDQIic5YWczRGClxJBCxDiL_s6teJ65Dapm5x5DWIsOUTCqyjVLcoezX-9WEgidN2_Q92s79VwVzFQeTEyHdKGnWDLlyrze91hhup2s_vK74THtGmPjsJZ8PSFv3BYnJMwSldqK7EJj76n3RE_MLFBATtUpAz1u",
                                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMl5kGLwYqkSoXJ-JAB7lEDXuQlLwcvwrERzOun6uKByO_t6dE85W2MzEA7UdcChG5xUl02tQ6zCc3QWgwXVj8OI1c2YV_Ke6oZtubu7VVrs7J6qswkUWd7ugE4w5Xp4spGY8hZNPCIW9DVVwc_-u77IbnnBgircaCGScfaQaQYcSbQsF9hFxBfl7uv4bTrlKWdJ2kedZvQIG4nYL3z6N2GKmnciw1T8zKPuH8r_mEQabDYqSYFysq1tzWK88u_kYeDEdiw83UvzI",
                                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDixxe64NMM7awr2ISzfHL16DrofjYjSQINiqb4TN3As_JRly6DLwFvcYg2mmhSHgRt6CGGdmKAqlekB1xvZn3ypvE3wH4-w1oPqR4sw3yzvXMzJpQpaVUzS3YhAcxvSHp9cc3EOCUXvypS5XI92mJRhl5hZ6o4zh3pM6mZYhGkygl9Ncin60P7Fw0ezmy7o62G0ALiBH6fsJIz59rHPzzMBqgTKr_-D0BD0KyCRKysQtESd2eaHVq6KKeo791ZO7wIp44XbYk8xEAW",
                                    ].map((src, i) => (
                                        <div
                                            key={i}
                                            className="relative h-10 w-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
                                        >
                                            <Image src={src} alt="User" fill className="object-cover" />
                                        </div>
                                    ))}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-accent text-xs font-bold text-primary">
                                        +120
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-slate-600">
                                    Coworkers already joined
                                </div>
                            </div>
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-[#004f93] active:scale-[0.98]"
                                type="submit"
                            >
                                LOGIN
                                <span className="material-symbols-outlined text-[20px]">
                                    arrow_forward
                                </span>
                            </button>

                            <div className="mt-4 flex flex-col items-center gap-4 text-center">
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
