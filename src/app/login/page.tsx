"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light text-slate-900 font-display">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-14 items-center justify-center bg-ikea-blue">
                        <div className="size-2.5 rounded-full bg-ikea-yellow"></div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold leading-tight tracking-tight text-slate-900 lg:text-base">
                            Wellbeing Monitor
                        </h2>
                        <span className="text-xs text-slate-500">
                            IT & Digital Indonesia
                        </span>
                    </div>
                </div>
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
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                <span className="material-symbols-outlined text-[16px]">
                                    directions_walk
                                </span>
                                Challenge 2024
                            </div>
                            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-slate-900 lg:text-5xl">
                                Track your <br />
                                <span className="text-primary">journey to 150km</span>
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

                        <form className="flex flex-col gap-6">
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
                                        type="password"
                                        placeholder="Enter your password"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-slate-600 peer-focus:text-primary">
                                        <span className="material-symbols-outlined text-[20px]">
                                            visibility
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
                                type="button"
                                onClick={() => router.push('/dashboard')}
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
                    © IKEA IT & Digital Indonesia 2024. All rights reserved.
                </footer>
            </main>
        </div>
    );
}
