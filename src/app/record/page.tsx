"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import clsx from "clsx";
import { addActivity } from "@/lib/userData";

export default function RecordPage() {
    const router = useRouter();
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [location, setLocation] = useState<string>('');
    const [distance, setDistance] = useState<number>(1.0);
    const [calories, setCalories] = useState<number>(200);
    const [photo, setPhoto] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCaloriesChange = (delta: number) => {
        const newValue = Math.max(10, Math.min(1000, calories + delta));
        setCalories(newValue);
    };

    const handleSave = () => {
        // Validation
        if (!photo) {
            setError('Photo evidence is required');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (calories < 10 || calories > 1000) {
            setError('Calories must be between 10-1000');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (!location.trim()) {
            setError('Please enter the exercise location');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (distance <= 0 || distance > 50) {
            setError('Distance must be between 0.1-50 km');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setStatus('saving');
        setError(null);

        // Save activity to localStorage
        setTimeout(() => {
            addActivity({
                date,
                location: location.trim(),
                distance,
                calories,
                photo: photo || '',
            });

            setStatus('success');

            // Redirect after showing success message
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }, 1000);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-[#f5f5f5] text-black font-display overflow-x-hidden selection:bg-accent selection:text-primary">
            <div className="w-full max-w-lg flex flex-col flex-grow pb-28 relative bg-[#f5f5f5]">
                <header className="flex items-center justify-between px-6 py-6 pt-8 bg-white shadow-sm mb-4">
                    <div className="flex flex-col">
                        <h1 className="text-primary text-2xl font-bold leading-tight tracking-tight">Record Activity</h1>
                        <p className="text-text-muted text-sm">Log your walking calories</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <div className="px-6 flex flex-col gap-6 w-full">
                    {/* Date Input */}
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

                    {/* Exercise Location Input */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-500 mb-2 ml-1">Exercise Location</label>
                        <div className="flex items-center w-full rounded-full bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary overflow-hidden h-14 transition-all hover:bg-gray-50/50 shadow-sm">
                            <div className="pl-4 pr-3 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined filled">location_on</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none text-black placeholder-gray-400 focus:ring-0 px-0 text-base focus:outline-none"
                                placeholder="e.g., BSD Green Office Park"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={{ color: 'black' }}
                            />
                        </div>
                    </div>

                    {/* Distance Input */}
                    <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">straighten</span>
                            <label className="text-sm font-bold text-gray-700">Jarak (Distance)</label>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => setDistance(Math.max(0.1, Math.round((distance - 0.5) * 10) / 10))}
                                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center text-primary font-bold text-2xl"
                            >
                                −
                            </button>
                            <div className="flex-1 max-w-[160px]">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="number"
                                        value={distance}
                                        onChange={(e) => setDistance(Math.max(0.1, Math.min(50, Number(e.target.value))))}
                                        className="w-24 text-center text-4xl font-black text-primary bg-transparent border-none focus:outline-none focus:ring-0"
                                        min={0.1}
                                        max={50}
                                        step={0.1}
                                    />
                                    <span className="text-xl font-bold text-primary/70 ml-1">km</span>
                                </div>
                                <p className="text-center text-sm text-gray-400 mt-1">kilometers</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDistance(Math.min(50, Math.round((distance + 0.5) * 10) / 10))}
                                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center text-primary font-bold text-2xl"
                            >
                                +
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-3">
                            Range: 0.1 - 50 km
                        </p>
                    </section>

                    {/* Calories Input */}
                    <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">local_fire_department</span>
                            <label className="text-sm font-bold text-gray-700">Calories Burned</label>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => handleCaloriesChange(-10)}
                                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center text-primary font-bold text-2xl"
                            >
                                −
                            </button>
                            <div className="flex-1 max-w-[160px]">
                                <input
                                    type="number"
                                    value={calories}
                                    onChange={(e) => setCalories(Math.max(10, Math.min(1000, Number(e.target.value))))}
                                    className="w-full text-center text-4xl font-black text-primary bg-transparent border-none focus:outline-none focus:ring-0"
                                    min={10}
                                    max={1000}
                                />
                                <p className="text-center text-sm text-gray-400 mt-1">calories</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCaloriesChange(10)}
                                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center text-primary font-bold text-2xl"
                            >
                                +
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-3">
                            Range: 10 - 1,000 cal
                        </p>
                    </section>

                    {/* Photo Upload Section */}
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
                                {error}
                            </p>
                        )}
                    </section>

                    {/* Action Button */}
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
                        <p className="text-slate-500">
                            +{calories} calories added to your progress!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
