import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Activity History | Wellbeing Monitor",
};

export default function HistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
