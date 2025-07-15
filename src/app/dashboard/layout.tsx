
'use client';

import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                {children}
              </div>
            </div>
        </SidebarProvider>
    );
}
