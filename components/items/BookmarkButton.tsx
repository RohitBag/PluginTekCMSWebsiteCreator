"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleBookmark } from "./actions"; // We'll create this next
import AuthModal from "../auth/AuthModal";
import { createClient } from "@/utils/supabase/client";

interface BookmarkButtonProps {
    itemId: number;
    initialIsBookmarked: boolean;
    className?: string;
}

export default function BookmarkButton({ itemId, initialIsBookmarked, className = "" }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigating if inside a Link

        // Check if client-side user exists (quick check)
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        // Optimistic update
        const newState = !isBookmarked;
        setIsBookmarked(newState);
        setIsLoading(true);

        const result = await toggleBookmark(itemId);

        if (result?.error) {
            // Revert on error
            setIsBookmarked(!newState);
        }
        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`flex items-center justify-center transition-all ${isBookmarked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ${className}`}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark this item"}
            >
                <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
            </button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
