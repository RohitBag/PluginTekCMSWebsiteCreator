"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) setShouldRender(true);
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) setShouldRender(false);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
            onTransitionEnd={handleAnimationEnd}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className={`relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 transform transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-primary-hover">
                        <i className="fas fa-user-lock text-xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Login Required</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Please sign in or create an account to bookmark items.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="block w-full py-2.5 bg-black dark:bg-white text-white dark:text-black text-center rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="block w-full py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-center rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
