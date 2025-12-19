import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Record Activity | Wellbeing Monitor",
};

export default function RecordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
