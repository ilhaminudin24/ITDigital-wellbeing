"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import clsx from "clsx";

export default function RecordPage() {
    const router = useRouter();
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [photo, setPhoto] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
    const [error, setError] = useState<boolean>(false);
    const [shake, setShake] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
                setError(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!photo) {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setStatus('saving');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');

            // Redirect after showing success message
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-[#f5f5f5] text-black font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28 relative bg-[#f5f5f5]">
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex flex-col">
                        {/* Header Left */}
                        <h1 className="text-primary text-2xl font-bold leading-tight tracking-tight">Record Activity</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <div className="px-6 flex flex-col gap-6 w-full">
                    {/* Map Section - Embedded Seamlessly */}
                    <div className="rounded-3xl overflow-hidden relative h-[250px] w-full group">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgzqYZRdI1ETAZSM3DLPyOqazimId35wXxdbm6nikerX--KYlYAQ-3jsp1P_wv14KPYqhNW6cZxH-ZREJqH3uY2lxwyrrUkCz-4NkKe7RazGRkMFw1KIyejN2J1m1Kavr00ddw98Fj_bEyOYGo-ja5nlJi1kehP8UqFte7X3IMd4Lqj0g_soo56_MtWsaeSRlGeFPuLHcw6Vo6sfNdD3sw4HaiFlQAoxM8LxbBS3sDZtoqaLELciGdHcs-wxI_CnaQHtvRimduiW7i')",
                                opacity: 0.8
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            <button className="size-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-50 active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                            <button className="size-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-gray-50 active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                            </button>
                        </div>

                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-primary">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            Route Active
                        </div>
                    </div>

                    {/* Date Input - New Field */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Date</label>
                        <div className="flex items-center w-full rounded-full bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary overflow-hidden h-14 transition-all hover:bg-gray-50/50 shadow-sm relative">
                            <div className="pl-4 pr-3 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined filled">calendar_today</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none text-black placeholder-gray-400 focus:ring-0 px-0 text-base focus:outline-none h-full"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ color: 'black' }}
                            />
                        </div>
                    </div>

                    {/* Inputs Section - Clean on Background */}
                    <section className="relative flex flex-col gap-4">
                        <div className="absolute left-[29px] top-12 bottom-12 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

                        {/* Starting Point (A) */}
                        <div className="relative z-10 group">
                            <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Starting Point (A)</label>
                            <div className="flex items-center w-full rounded-full bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary overflow-hidden h-14 transition-all hover:bg-gray-50/50 shadow-sm">
                                <div className="pl-4 pr-3 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined filled">my_location</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none text-black placeholder-gray-400 focus:ring-0 px-0 text-base focus:outline-none"
                                    placeholder="Current Location"
                                    type="text"
                                    defaultValue="IKEA Alam Sutera"
                                    style={{ color: 'black' }}
                                />
                            </div>
                        </div>

                        {/* Destination (B) */}
                        <div className="relative z-10 group">
                            <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Destination (B)</label>
                            <div className="flex items-center w-full rounded-full bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary overflow-hidden h-14 transition-all hover:bg-gray-50/50 shadow-sm">
                                <div className="pl-4 pr-3 flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">flag</span>
                                </div>
                                <input
                                    className="w-full bg-transparent border-none text-black placeholder-gray-400 focus:ring-0 px-0 text-base focus:outline-none"
                                    placeholder="Where are you walking?"
                                    type="text"
                                    style={{ color: 'black' }}
                                />
                                <div className="pr-4 flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-600">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Photo Upload Section - Mandatory */}
                    <section className={clsx("flex flex-col gap-2", shake && "animate-shake")}>
                        <div
                            onClick={() => !photo && fileInputRef.current?.click()}
                            className={clsx(
                                "relative w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer",
                                photo ? "h-48 border-transparent" : "h-32 border-gray-300 hover:border-primary hover:bg-blue-50/50"
                            )}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />

                            {photo ? (
                                <>
                                    <img src={photo} alt="Activity Preview" className="absolute inset-0 w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPhoto(null);
                                        }}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                    <span className="text-sm font-medium">Upload Activity Photo</span>
                                </div>
                            )}
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm font-medium ml-1 flex items-center gap-1 animate-pulse">
                                <span className="material-symbols-outlined text-[16px] filled">error</span>
                                Photo evidence is required
                            </p>
                        )}
                    </section>

                    {/* Stats Section - Flat Typography */}
                    <section className="flex items-center justify-between px-2 pt-2">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">straighten</span>
                                Distance
                            </div>
                            <p className="text-3xl font-bold text-black tracking-tight">2.4 <span className="text-lg text-primary">km</span></p>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <div className="flex items-center justify-end gap-2 text-gray-500 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">timer</span>
                                Est. Time
                            </div>
                            <p className="text-3xl font-bold text-black tracking-tight">30 <span className="text-lg text-primary">min</span></p>
                        </div>
                    </section>

                    {/* Action Button - Inherited Style */}
                    {/* Action Button - Inherited Style */}
                    <button
                        onClick={handleSave}
                        disabled={status !== 'idle'}
                        className={clsx(
                            "w-full font-bold text-lg h-14 rounded-full flex items-center justify-center gap-2 shadow-md transition-all",
                            status === 'idle' ? "bg-primary hover:bg-[#004f93] active:scale-[0.98] text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {status === 'idle' && (
                            <>
                                <span className="material-symbols-outlined filled text-accent">directions_walk</span>
                                SAVE ACTIVITY
                            </>
                        )}
                        {status === 'saving' && (
                            <>
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
                                Saving...
                            </>
                        )}
                        {status === 'success' && (
                            <span className="text-green-600 flex items-center gap-2">
                                <span className="material-symbols-outlined filled">check_circle</span>
                                Saved!
                            </span>
                        )}
                    </button>
                </div>

                {/* Success Toast Overlay */}
                <div className={clsx(
                    "fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
                    status === 'success' ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-1">
                            <span className="material-symbols-outlined text-4xl text-green-600 filled">emoji_events</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Great Job!</h3>
                        <p className="text-slate-500">Activity saved successfully.</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
