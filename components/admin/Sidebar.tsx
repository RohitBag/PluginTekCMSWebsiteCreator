"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Briefcase, Settings, LayoutDashboard, LogOut, Menu, X, List, Layers, Users, ChevronDown, ChevronRight, Home, HardDrive } from "lucide-react";
import { logout } from "@/app/login/actions";
import clsx from "clsx";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [homeMenuOpen, setHomeMenuOpen] = useState(true);
    const pathname = usePathname();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Also auto-open Home Menu if a child is active
    useEffect(() => {
        const homeRoutes = ['/admin/layout-editor', '/admin/sections', '/admin/services', '/admin/projects', '/admin/items'];
        if (homeRoutes.some(route => pathname.startsWith(route))) {
            setHomeMenuOpen(true);
        }
    }, [pathname]);

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                suppressHydrationWarning
                className={clsx(
                    "w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col h-screen shrink-0 z-40 transition-transform duration-300 ease-in-out",
                    // Desktop: always visible and sticky
                    "md:sticky md:top-0 md:translate-x-0",
                    // Mobile: fixed position, transform based on isOpen state
                    "fixed top-0 left-0",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                    <h1 className="text-xl font-bold text-purple-600 dark:text-purple-500">
                        PluginTek Website Manager
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {/* Home Page Layout Group */}
                    <div>
                        <button
                            onClick={() => setHomeMenuOpen(!homeMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-gray-500 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <Layers size={18} />
                                Home Page Layout
                            </span>
                            {homeMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        
                        {homeMenuOpen && (
                            <div className="mt-1 ml-4 border-l border-gray-100 dark:border-zinc-800 space-y-1">
                                <NavLink href="/admin/layout-editor" icon={<Home size={18} />} label="Home page" sub />
                                <NavLink href="/admin/sections" icon={<LayoutDashboard size={18} />} label="Custom sections" sub />
                                <NavLink href="/admin/services" icon={<Briefcase size={18} />} label="Services" sub />
                                <NavLink href="/admin/projects" icon={<FileText size={18} />} label="Gallery" sub />
                                <NavLink href="/admin/items" icon={<List size={18} />} label="Items" sub />
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <NavLink href="/admin/pages" icon={<FileText size={20} />} label="Pages" />
                        <NavLink href="/admin/users" icon={<Users size={20} />} label="Users" />
                        <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Site Content" />
                        <NavLink href="/admin/backup" icon={<HardDrive size={20} />} label="Backup & Restore" />
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                    <form action={logout}>
                        <button type="submit" className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors w-full">
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}

function NavLink({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                isActive
                    ? "bg-primary/5 dark:bg-amber-900/10 text-primary-hover dark:text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800",
                sub && "py-2.5 ml-2"
            )}
        >
            <span className={clsx(
                "transition-colors",
                isActive ? "text-primary" : "text-gray-400 group-hover:text-primary",
                sub && "scale-90"
            )}>{icon}</span>
            {label}
        </Link>
    );
}
