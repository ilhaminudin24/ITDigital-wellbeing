"use client";

import Image from "next/image";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    withText?: boolean;
    className?: string;
}

const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
};

export default function Logo({ size = "md", withText = false, className = "" }: LogoProps) {
    const pixelSize = sizeMap[size];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Image
                src="/ITDigital-wellbeing/logo.png"
                alt="IT&Digital Wellbeing Monitor Logo"
                width={pixelSize}
                height={pixelSize}
                className="object-contain"
                priority
            />
            {withText && (
                <div className="flex flex-col">
                    <h2 className="text-sm font-bold leading-tight tracking-tight text-slate-900 lg:text-base">
                        Wellbeing Monitor
                    </h2>
                    <span className="text-xs text-slate-500">
                        IT & Digital Indonesia
                    </span>
                </div>
            )}
        </div>
    );
}
