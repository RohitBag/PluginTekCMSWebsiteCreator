"use client";

import { Plus, Trash2, Edit2, GripVertical, Loader2, Star, User, Upload, X } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Testimonial, addTestimonial, updateTestimonial, deleteTestimonial } from "@/app/admin/testimonials/actions";
import { uploadImage } from "@/app/admin/actions/upload";
import { useRouter } from "next/navigation";

export default function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [rating, setRating] = useState(5);
    const router = useRouter();

    const handleOpen = (testimonial?: Testimonial) => {
        setEditingTestimonial(testimonial || null);
        setImageUrl(testimonial?.image_url || "");
        setRating(testimonial?.rating || 5);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingTestimonial(null);
        setImageUrl("");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('imageFile', file);
        formData.append('folder', 'testimonials');

        const result = await uploadImage(formData);
        setIsUploading(false);

        if (result.success && result.url) {
            setImageUrl(result.url);
        } else {
            alert(result.message || "Failed to upload image");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            content: formData.get("content") as string,
            image_url: imageUrl,
            rating: rating,
            display_order: parseInt(formData.get("display_order") as string) || 0,
            is_enabled: true,
        };

        let result;
        if (editingTestimonial) {
            result = await updateTestimonial(editingTestimonial.id, data);
        } else {
            result = await addTestimonial(data);
        }

        setIsLoading(false);
        if (result.success) {
            handleClose();
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        setIsLoading(true);
        const result = await deleteTestimonial(id);
        setIsLoading(false);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Testimonials</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage the reviews displayed on your site.</p>
                </div>
                <button
                    onClick={() => handleOpen()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Testimonial
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {initialTestimonials.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl">
                        <User className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-gray-500">No testimonials yet. Add your first client review.</p>
                    </div>
                ) : (
                    initialTestimonials.map((t) => (
                        <div key={t.id} className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex-shrink-0">
                                    {t.image_url ? (
                                        <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{t.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{t.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        className={i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-zinc-700"} 
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-zinc-300 line-clamp-4 italic mb-4">
                                "{t.content}"
                            </p>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                <button
                                    onClick={() => handleOpen(t)}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Name</label>
                            <input
                                name="name"
                                type="text"
                                defaultValue={editingTestimonial?.name}
                                required
                                placeholder="e.g. Jane Doe"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Designation</label>
                            <input
                                name="role"
                                type="text"
                                defaultValue={editingTestimonial?.role}
                                placeholder="e.g. CEO, Homeowner"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author Photo</label>
                        <div className="flex items-center gap-4">
                            {imageUrl && (
                                <div className="relative w-16 h-16 rounded-full border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 p-1 group overflow-hidden">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => setImageUrl("")}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            <div className="flex-1">
                                <label className={`
                                    flex flex-col items-center justify-center w-full h-16 
                                    border-2 border-dashed border-gray-300 dark:border-zinc-700 
                                    rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 
                                    transition-all overflow-hidden relative
                                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}>
                                    <div className="flex flex-col items-center justify-center py-2">
                                        {isUploading ? (
                                            <Loader2 className="animate-spin text-primary" size={20} />
                                        ) : (
                                            <>
                                                <Upload className="text-gray-400 mb-1" size={20} />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Upload profile photo</p>
                                            </>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 rounded-md transition-colors"
                                >
                                    <Star 
                                        size={24} 
                                        className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-zinc-700"} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">The Review</label>
                        <textarea
                            name="content"
                            rows={4}
                            defaultValue={editingTestimonial?.content}
                            required
                            placeholder="Paste the customer feedback here..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
                        <input
                            name="display_order"
                            type="number"
                            defaultValue={editingTestimonial?.display_order || 0}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="animate-spin" size={16} />}
                            {editingTestimonial ? "Save Changes" : "Add Testimonial"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
