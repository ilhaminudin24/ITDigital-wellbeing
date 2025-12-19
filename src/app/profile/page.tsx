"use client";

import Image from "next/image";


export default function Profile() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light text-text-dark font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            {/* Mobile Container */}
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-primary text-2xl font-bold leading-tight tracking-tight">Profile</h1>
                        {/* Invisible placeholder to match Dashboard/History header height */}
                        <p className="text-transparent text-sm font-medium select-none">Placeholder</p>
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
                                alt="Ahmad Avatar"
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                        <h2 className="mb-1 text-2xl font-extrabold text-primary">Ilham</h2>
                        <p className="mb-5 font-medium text-gray-500">IT & Digital Team</p>
                        <div className="flex flex-wrap justify-center w-full gap-2">
                            <span className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm rounded-xl bg-accent text-primary">
                                WALKER LVL 5
                            </span>
                            <span className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide shadow-sm rounded-xl bg-accent text-primary">
                                TOP 10%
                            </span>
                        </div>
                    </div>

                    {/* Personal Statistics */}
                    <div className="p-6 bg-white shadow-sm rounded-3xl border border-gray-100">
                        <h3 className="mb-6 text-lg font-extrabold text-primary">Personal Statistics</h3>
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-end justify-between mb-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold text-primary">45.2</span>
                                        <span className="text-lg font-bold text-primary">KM</span>
                                    </div>
                                    <div className="px-2 py-1 mb-2 text-xs font-bold rounded-md text-primary bg-blue-50">
                                        Goal: 150km
                                    </div>
                                </div>
                                <div className="w-full h-4 overflow-hidden bg-gray-100 rounded-full shadow-inner">
                                    <div className="h-full rounded-full shadow-sm bg-accent w-[30%]"></div>
                                </div>
                            </div>
                            <div className="w-full h-px bg-gray-100"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">Global Rank</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-extrabold text-primary">#12</span>
                                        <span className="flex items-center px-2 py-1 text-xs font-bold text-green-700 rounded bg-green-50">
                                            <span className="mr-0.5 text-sm material-symbols-outlined">arrow_upward</span> 3
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-accent text-primary">
                                    <span className="text-2xl material-symbols-outlined">emoji_events</span>
                                </div>
                            </div>
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
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
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
                                    <input type="checkbox" className="sr-only peer" />
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
                    <button className="flex items-center justify-center w-full gap-2 px-4 py-4 mt-2 mb-8 text-lg font-bold text-white transition-all shadow-lg rounded-2xl bg-primary hover:bg-blue-800 hover:shadow-xl group">
                        <span className="text-[24px] material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </main>
            </div>
        </div>
    );
}
