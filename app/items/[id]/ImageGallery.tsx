"use client";

import { useState } from "react";
import clsx from "clsx";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 aspect-video shadow-sm flex items-center justify-center text-gray-400">
                No Image Available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 aspect-video shadow-sm relative group">
                <img
                    src={mainImage || images[0]}
                    alt="Property View"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={clsx(
                                "rounded-lg overflow-hidden aspect-square cursor-pointer transition-all border-2",
                                mainImage === img
                                    ? "border-primary opacity-100"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-zinc-700"
                            )}
                            onClick={() => setMainImage(img)}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
