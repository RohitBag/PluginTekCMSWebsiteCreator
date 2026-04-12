"use client";

import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2, LayoutTemplate } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Page, upsertPage, deletePage, PageImage, getPageImages, uploadPageImage, deletePageImage } from "@/app/admin/pages/actions";
import { Copy, LayoutPanelLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SEOAssistant from "./SEOAssistant";

export default function PagesManager({ initialPages, siteName }: { initialPages: Page[], siteName: string }) {
    const pages = initialPages;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [pageImages, setPageImages] = useState<PageImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
    
    // SEO State
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [pageContent, setPageContent] = useState("");
    
    const router = useRouter();

    const handleOpen = (page?: Page) => {
        setEditingPage(page || null);
        setPreviewImage(page?.image_url || null);
        setSeoTitle(page?.seo_title || "");
        setSeoDescription(page?.seo_description || "");
        setPageContent(page?.content || "");
        setActiveTab('content');

        if (page?.id) {
            getPageImages(page.id).then(setPageImages);
        } else {
            setPageImages([]);
        }

        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingPage(null);
        setPreviewImage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleMultipleImageUpload = async (files: File[]) => {
        if (!editingPage || files.length === 0) return;

        setIsUploading(true);
        let successCount = 0;

        for (const file of files) {
            const formData = new FormData();
            formData.append('pageId', editingPage.id.toString());
            formData.append('imageFile', file);

            const result = await uploadPageImage(formData);
            if (result.success) {
                successCount++;
            } else {
                console.error(`Failed to upload ${file.name}:`, result.message);
            }
        }

        if (successCount > 0) {
            const images = await getPageImages(editingPage.id);
            setPageImages(images);
        }

        if (successCount < files.length) {
            alert(`Uploaded ${successCount} of ${files.length} images. Check console for details.`);
        }
        
        setIsUploading(false);
    };

    const handlePageImageDelete = async (imageId: number, storagePath: string) => {
        if (!confirm("Delete this image?")) return;
        
        const result = await deletePageImage(imageId, storagePath);
        if (result.success && editingPage) {
            const images = await getPageImages(editingPage.id);
            setPageImages(images);
        } else if (!result.success) {
            alert(result.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        if (editingPage) {
            formData.append('id', editingPage.id.toString());
            formData.append('existingImage', editingPage.image_url || '');
        }

        formData.append('seo_title', seoTitle);
        formData.append('seo_description', seoDescription);
        formData.append('content', pageContent);

        const result = await upsertPage(formData);

        setIsLoading(false);
        if (result.success) {
            handleClose();
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (id: number, slug: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        setIsLoading(true);
        const result = await deletePage(id, slug);
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dynamic Pages</h2>
                    <p className="text-gray-500 mt-1">Manage pages that can be linked to your services.</p>
                </div>
                <button
                    onClick={() => handleOpen()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Create Page
                </button>
            </div>

            <div className="space-y-4">
                {pages.map((page) => (
                    <div key={page.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex gap-4 items-center">
                        <div className="h-16 w-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-700">
                            {page.image_url ? (
                                <img src={page.image_url} alt={page.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                {page.title}
                                <Link href={`/p/${page.slug}`} target="_blank" className="text-xs text-blue-500 hover:underline font-normal">
                                    /p/{page.slug}
                                </Link>
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                                {page.content.replace(/<[^>]+>/g, '') || "No content"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleOpen(page)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors"
                                title="Edit Page Details"
                            >
                                <Edit2 size={18} />
                            </button>
                            <Link
                                href={`/admin/pages/${page.id}`}
                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-amber-900/10 rounded-lg transition-colors"
                                title="Manage Page Layout"
                            >
                                <LayoutTemplate size={18} />
                            </Link>
                            <button
                                onClick={() => handleDelete(page.id, page.slug)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {pages.length === 0 && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                        No pages created yet.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingPage ? "Edit Page" : "Create New Page"}
            >
                <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'content' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'
                        }`}
                    >
                        <LayoutPanelLeft size={16} />
                        Page Content
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('seo')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'seo' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'
                        }`}
                    >
                        <Search size={16} />
                        SEO & Google Preview
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    defaultValue={editingPage?.title}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Slug</label>
                                <div className="flex items-center">
                                    <span className="px-3 py-2 bg-gray-100 dark:bg-zinc-800 border-y border-l border-gray-300 dark:border-zinc-700 rounded-l-lg text-sm text-gray-500 font-mono">
                                        /p/
                                    </span>
                                    <input
                                        name="slug"
                                        type="text"
                                        defaultValue={editingPage?.slug}
                                        placeholder="my-awesome-page"
                                        required
                                        pattern="[a-z0-9-]+"
                                        title="Only lowercase letters, numbers, and hyphens"
                                        className="flex-1 px-4 py-2 rounded-r-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Image (Optional)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-zinc-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800/50 overflow-hidden relative">
                                        {previewImage ? (
                                            <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImageIcon className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload image</p>
                                            </div>
                                        )}
                                        <input
                                            name="imageFile"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HTML Content</label>
                                <textarea
                                    name="content"
                                    rows={8}
                                    value={pageContent}
                                    onChange={(e) => setPageContent(e.target.value)}
                                    placeholder="<div>Your rich HTML content here...</div>"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Images (for HTML Content)</label>
                                {editingPage ? (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                            {pageImages.map((img) => (
                                                <div key={img.id} className="relative group aspect-video bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                                                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                                        <p className="text-[10px] text-white font-mono break-all text-center">[[img-{img.id}]]</p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`[[img-${img.id}]]`);
                                                                    alert(`Placeholder [[img-${img.id}]] copied to clipboard!`);
                                                                }}
                                                                className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                                title="Copy Placeholder"
                                                            >
                                                                <Copy size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePageImageDelete(img.id, img.storage_path)}
                                                                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                                title="Delete Image"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <label className="flex flex-col items-center justify-center aspect-video border-2 border-gray-300 dark:border-zinc-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                {isUploading ? <Loader2 className="animate-spin text-gray-400" size={20} /> : <Plus className="text-gray-400" size={20} />}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files && files.length > 0) {
                                                            handleMultipleImageUpload(Array.from(files));
                                                        }
                                                    }} 
                                                    disabled={isUploading} 
                                                    multiple 
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">Upload multiple images and use their IDs (e.g. <code>[[img-5]]</code>) in your HTML. Click the copy icon on an image to get its placeholder. Save the page first to upload images.</p>
                                    </>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                                        <p className="text-sm font-medium text-primary-hover dark:text-primary mb-1">Save First to Upload Images</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">You must create and save the page before uploading multiple images.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <SEOAssistant
                            title={seoTitle}
                            description={seoDescription}
                            content={pageContent}
                            siteName={siteName}
                            onUpdate={(field, val) => {
                                if (field === 'title') setSeoTitle(val);
                                else setSeoDescription(val);
                            }}
                        />
                    )}

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
                            {editingPage ? "Save Changes" : "Create Page"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
