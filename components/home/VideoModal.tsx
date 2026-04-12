"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { EmbedType } from "@/utils/embed";

type VideoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    embedUrl: string;
    embedType: EmbedType;
    title: string;
};

export default function VideoModal({ isOpen, onClose, embedUrl, embedType, title }: VideoModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={onClose}
        >
            <div 
                className={`relative w-full shadow-2xl overflow-hidden bg-black rounded-xl ${
                    embedType === 'instagram' 
                        ? 'max-w-md aspect-[9/16] h-[80vh] md:h-[90vh]' 
                        : 'max-w-5xl aspect-video'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[10000] p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors border border-white/20"
                >
                    <X size={20} />
                </button>
                
                <iframe
                    src={embedUrl}
                    title={title}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
