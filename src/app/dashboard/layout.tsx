
'use client';

import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
