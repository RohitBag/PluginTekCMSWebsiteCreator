"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProjectCarouselProps = {
    images: { id: number; image_url: string; display_order: number }[];
    title: string;
    description?: string;
};

export default function ProjectCarousel({ images, title, description }: ProjectCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    // Auto-advance carousel every 5 seconds
    useEffect(() => {
        if (sortedImages.length <= 1) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, sortedImages.length]);

    if (sortedImages.length === 0) {
        return (
            <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                <span className="text-gray-400">No images</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full group">
            {/* Current Image */}
            <img
                src={sortedImages[currentIndex].image_url}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Description Overlay (only on first image) */}
            {currentIndex === 0 && description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                    <p className="text-white text-sm leading-relaxed">{description}</p>
                </div>
            )}

            {/* Navigation Arrows (only if multiple images) */}
            {sortedImages.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {sortedImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? "bg-white w-6"
                                        : "bg-white/50 hover:bg-white/75"
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
