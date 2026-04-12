import type { Metadata } from "next";
import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard | PluginTek Website Manager",
    description: "Manage website contents",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
            <Sidebar />
            <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
