"use client";

import { useEffect, useState } from "react";
import { Info, AlertCircle, CheckCircle2, Wand2 } from "lucide-react";

interface SEOAssistantProps {
    title: string;
    description: string;
    content: string; // The base content to generate from
    siteName: string;
    onUpdate: (field: 'title' | 'description', value: string) => void;
}

export default function SEOAssistant({ 
    title, 
    description, 
    content, 
    siteName, 
    onUpdate 
}: SEOAssistantProps) {
    const [titleStatus, setTitleStatus] = useState<"ok" | "warning" | "error">("ok");
    const [descStatus, setDescStatus] = useState<"ok" | "warning" | "error">("ok");

    useEffect(() => {
        const tLen = title.length;
        if (tLen === 0) setTitleStatus("warning");
        else if (tLen > 60) setTitleStatus("error");
        else if (tLen < 30) setTitleStatus("warning");
        else setTitleStatus("ok");

        const dLen = description.length;
        if (dLen === 0) setDescStatus("warning");
        else if (dLen > 160) setDescStatus("error");
        else if (dLen < 70) setDescStatus("warning");
        else setDescStatus("ok");
    }, [title, description]);

    const handleSmartFill = () => {
        // Simple logic: Use current title for SEO title if empty, 
        // and first 155 chars of content for description.
        if (!title) {
            // We assume the parent will provide the context's main title in some way or we just use what's there
        }
        
        const cleanContent = content
            .replace(/<[^>]*>?/gm, '') // Remove HTML
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        const newDesc = cleanContent.substring(0, 155) + (cleanContent.length > 155 ? "..." : "");
        onUpdate('description', newDesc);
    };

    return (
        <div className="space-y-8">
            {/* Google Preview */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <Info size={14} />
                    Google Search Preview
                </div>
                <div className="max-w-[600px] font-sans">
                    <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl hover:underline cursor-pointer truncate mb-1">
                        {title || "Page Title Goes Here"} | {siteName}
                    </div>
                    <div className="text-[#006621] dark:text-[#34a853] text-sm mb-1 truncate">
                        https://your-site.com/p/your-page-slug
                    </div>
                    <div className="text-[#4d5156] dark:text-[#bdc1c6] text-sm line-clamp-2 leading-relaxed">
                        {description || "Provide a description to see how it will look in search results. A good description increases click-through rates."}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
                <div className="relative">
                    <div className="flex justify-between items-end mb-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Title</label>
                        <span className={`text-[10px] font-bold ${titleStatus === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                            {title.length} / 60
                        </span>
                    </div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                        placeholder="Page title | Site Name"
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-zinc-800 outline-none transition-all dark:text-white ${
                            titleStatus === 'error' ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-zinc-700 focus:ring-primary'
                        }`}
                    />
                    <div className="mt-1 flex items-center gap-1.5">
                        {titleStatus === 'ok' && <CheckCircle2 size={12} className="text-green-500" />}
                        {titleStatus === 'warning' && <AlertCircle size={12} className="text-amber-500" />}
                        {titleStatus === 'error' && <AlertCircle size={12} className="text-red-500" />}
                        <p className="text-[11px] text-gray-500 italic">
                            {titleStatus === 'ok' && "Perfect length for Google."}
                            {titleStatus === 'warning' && "A bit short. Try making it more descriptive."}
                            {titleStatus === 'error' && "Too long. It will be cut off in search results."}
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex justify-between items-end mb-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Meta Description</label>
                        <span className={`text-[10px] font-bold ${descStatus === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                            {description.length} / 160
                        </span>
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => onUpdate('description', e.target.value)}
                        rows={3}
                        placeholder="Briefly describe what this page is about..."
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-zinc-800 outline-none transition-all dark:text-white ${
                            descStatus === 'error' ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-zinc-700 focus:ring-primary'
                        }`}
                    />
                    <div className="mt-1 flex items-center gap-1.5">
                        {descStatus === 'ok' && <CheckCircle2 size={12} className="text-green-500" />}
                        {descStatus === 'warning' && <AlertCircle size={12} className="text-amber-500" />}
                        {descStatus === 'error' && <AlertCircle size={12} className="text-red-500" />}
                        <p className="text-[11px] text-gray-500 italic">
                            {descStatus === 'ok' && "Perfect length for search results."}
                            {descStatus === 'warning' && "Too short. Add more keywords to improve rankings."}
                            {descStatus === 'error' && "Too long. The end will be truncated."}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSmartFill}
                    className="flex items-center gap-2 text-xs font-bold text-primary-hover hover:underline"
                >
                    <Wand2 size={14} />
                    Auto-generate from content
                </button>
            </div>
        </div>
    );
}
