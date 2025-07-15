
'use client';

import { Sidebar } from "@/components/layout/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar />
            <div className="relative flex min-h-screen flex-col sm:ml-12">
                <SiteHeader />
                <main className="flex-1 z-10">{children}</main>
            </div>
        </SidebarProvider>
    );
}
