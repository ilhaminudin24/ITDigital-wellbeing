import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Progress Report | Wellbeing Monitor",
};

export default function ReportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
