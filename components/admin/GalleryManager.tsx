"use client";

import { Upload, Trash2, GripVertical, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { ProjectImage, addGalleryImages, deleteGalleryImage, reorderGalleryImages } from "@/app/admin/projects/actions";
import { useRouter } from "next/navigation";

type GalleryManagerProps = {
    projectId: number;
    projectTitle: string;
    initialImages: ProjectImage[];
};

export default function GalleryManager({ projectId, projectTitle, initialImages }: GalleryManagerProps) {
    const [images, setImages] = useState<ProjectImage[]>(initialImages);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const router = useRouter();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const fileArray = Array.from(files);
        const result = await addGalleryImages(projectId, fileArray);
        setIsUploading(false);

        // Reset input
        e.target.value = '';

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (imageId: number) => {
        if (!confirm("Delete this image?")) return;
        setIsDeleting(imageId);
        const result = await deleteGalleryImage(imageId);
        setIsDeleting(null);
        if (result.success) {
            setImages(images.filter(img => img.id !== imageId));
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedItem = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        setImages(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        if (draggedIndex === null) return;

        const updates = images.map((img, index) => ({
            id: img.id,
            display_order: index + 1
        }));

        await reorderGalleryImages(updates);
        setDraggedIndex(null);
        router.refresh();
    };

    return (
        <div className="mt-6 border-t border-gray-200 dark:border-zinc-700 pt-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Gallery Images ({images.length})
                </h4>
                <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-md">
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    {isUploading ? "Uploading..." : "Add Images"}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800">
                    <Upload size={32} className="mx-auto mb-2 opacity-50" />
                    No gallery images yet. Click "Add Images" above!
                </div>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative rounded-lg overflow-hidden border-2 ${draggedIndex === index ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200 dark:border-zinc-700"
                                } cursor-move hover:border-blue-400 transition-all`}
                        >
                            <div className="aspect-square bg-gray-100 dark:bg-zinc-800">
                                <img
                                    src={image.image_url}
                                    alt={`${projectTitle} - Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Image Number Badge */}
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-bold">
                                {index + 1}
                            </div>

                            {/* Delete Button - Always Visible */}
                            <button
                                type="button"
                                onClick={() => handleDelete(image.id)}
                                disabled={isDeleting === image.id}
                                className="absolute top-1 right-1 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors disabled:opacity-50"
                            >
                                {isDeleting === image.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Trash2 size={14} />
                                )}
                            </button>

                            {/* Drag Handle */}
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white p-1 rounded">
                                <GripVertical size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Drag images to reorder. First image shows the description overlay.
            </p>
        </div>
    );
}
