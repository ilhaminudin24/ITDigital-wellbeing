import type { Metadata } from "next";
import { Spline_Sans, Noto_Sans } from "next/font/google";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Activity Dashboard",
  description: "Wellbeing Monitoring App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${splineSans.variable} ${notoSans.variable} font-display antialiased selection:bg-accent selection:text-primary`}
      >
        <div className="flex flex-col min-h-screen">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
