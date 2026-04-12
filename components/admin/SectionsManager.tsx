"use client";

import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2, Copy } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { CustomSection, upsertSection, deleteSection, SectionImage, getSectionImages, uploadSectionImage, deleteSectionImage } from "@/app/admin/sections/actions";
import { useRouter } from "next/navigation";
import { sectionTemplates } from "@/lib/sectionTemplates";

export default function SectionsManager({ initialSections, pageId, hideLayoutNotice }: { initialSections: CustomSection[], pageId?: number, hideLayoutNotice?: boolean }) {
    const sections = initialSections;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const router = useRouter();

    const [isHtml, setIsHtml] = useState(false);
    const [isMobileCustom, setIsMobileCustom] = useState(false);
    const [sectionImages, setSectionImages] = useState<SectionImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cssContent, setCssContent] = useState("");
    const [mobileContent, setMobileContent] = useState("");
    const [mobileCssContent, setMobileCssContent] = useState("");

    const handleOpen = async (section?: CustomSection) => {
        setEditingSection(section || null);
        setPreviewImage(section?.image_url || null);
        setRemoveImage(false);
        setIsHtml(section?.is_html || false);
        setIsMobileCustom(section?.is_mobile_custom || false);
        setTitle(section?.title || "");
        setContent(section?.content || "");
        setCssContent(section?.css_content || "");
        setMobileContent(section?.mobile_content || "");
        setMobileCssContent(section?.mobile_css_content || "");
        
        if (section?.id) {
            const images = await getSectionImages(section.id);
            setSectionImages(images);
        } else {
            setSectionImages([]);
        }
        
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingSection(null);
        setPreviewImage(null);
        setIsHtml(false);
        setIsMobileCustom(false);
        setSectionImages([]);
        setTitle("");
        setContent("");
        setCssContent("");
        setMobileContent("");
        setMobileCssContent("");
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        if (!templateId) return;
        const template = sectionTemplates.find(t => t.id === templateId);
        if (template) {
            setIsHtml(true);
            setIsMobileCustom(false);
            setContent(template.html);
            setCssContent(template.css);
            if (!title) setTitle(template.name);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setRemoveImage(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setRemoveImage(true);
        // Clear file input
        const fileInput = document.querySelector('input[name="imageFile"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleMultipleImageUpload = async (files: File[]) => {
        if (!editingSection || files.length === 0) return;

        setIsUploading(true);
        let successCount = 0;

        for (const file of files) {
            const formData = new FormData();
            formData.append('sectionId', editingSection.id.toString());
            formData.append('imageFile', file);

            const result = await uploadSectionImage(formData);
            if (result.success) {
                successCount++;
            } else {
                console.error(`Failed to upload ${file.name}:`, result.message);
            }
        }

        if (successCount > 0) {
            const images = await getSectionImages(editingSection.id);
            setSectionImages(images);
        }

        if (successCount < files.length) {
            alert(`Uploaded ${successCount} of ${files.length} images. Check console for details.`);
        }
        
        setIsUploading(false);
    };

    const handleSectionImageDelete = async (imageId: number, storagePath: string) => {
        if (!confirm("Delete this image?")) return;
        
        const result = await deleteSectionImage(imageId, storagePath);
        if (result.success && editingSection) {
            const images = await getSectionImages(editingSection.id);
            setSectionImages(images);
        } else if (!result.success) {
            alert(result.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        if (editingSection) {
            formData.append('id', editingSection.id.toString());
            formData.append('existingImage', editingSection.image_url);
        }
        
        if (removeImage) {
            formData.append('remove_image', 'true');
        }

        const result = await upsertSection(formData);

        setIsLoading(false);
        if (result.success) {
            handleClose();
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this section?")) return;
        setIsLoading(true);
        const result = await deleteSection(id);
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Custom Sections</h2>
                    {!hideLayoutNotice && (
                        <p className="text-gray-500 mt-1">Manage content. To reorder sections, use the <strong>Layout Editor</strong>.</p>
                    )}
                </div>
                <button
                    onClick={() => handleOpen()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Section
                </button>
            </div>

            <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex gap-4 items-center">
                        <div className="h-16 w-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-700">
                            {section.is_html ? (
                                <div className="w-full h-full flex items-center justify-center text-primary font-bold bg-primary/5 dark:bg-amber-900/10">HTML</div>
                            ) : section.image_url ? (
                                <img src={section.image_url} alt={section.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {section.is_html ? "Custom HTML Section" : section.content}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleOpen(section)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(section.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {sections.length === 0 && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                        No custom sections added yet.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingSection ? "Edit Section" : "Add New Section"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {pageId && <input type="hidden" name="page_id" value={pageId} />}
                    
                    {!editingSection && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start from Template (Optional)</label>
                            <select 
                                onChange={handleTemplateChange}
                                defaultValue=""
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white mb-4"
                            >
                                <option value="">-- Choose a predefined template --</option>
                                {sectionTemplates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Title</label>
                        <input
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_html"
                                name="is_html"
                                value="true"
                                checked={isHtml}
                                onChange={(e) => setIsHtml(e.target.checked)}
                                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <label htmlFor="is_html" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Use Custom HTML & CSS
                            </label>
                        </div>

                        {isHtml && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_mobile_custom"
                                    name="is_mobile_custom"
                                    value="true"
                                    checked={isMobileCustom}
                                    onChange={(e) => setIsMobileCustom(e.target.checked)}
                                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <label htmlFor="is_mobile_custom" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Use different HTML/CSS for mobile
                                </label>
                            </div>
                        )}
                    </div>

                    <div className={isMobileCustom ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {isHtml ? (isMobileCustom ? "Desktop HTML" : "HTML Content") : "Content"}
                            </label>
                            <textarea
                                name="content"
                                rows={isHtml ? 8 : 4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required={!isHtml}
                                placeholder={isHtml ? "<div>Desktop HTML...</div>" : "Section description..."}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            />
                        </div>

                        {isHtml && isMobileCustom && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile HTML</label>
                                <textarea
                                    name="mobile_content"
                                    rows={8}
                                    value={mobileContent}
                                    onChange={(e) => setMobileContent(e.target.value)}
                                    placeholder="<div>Mobile HTML...</div>"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                            </div>
                        )}
                    </div>

                    {isHtml && (
                        <div className={isMobileCustom ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {isMobileCustom ? "Desktop CSS" : "Custom CSS"}
                                </label>
                                <textarea
                                    name="css_content"
                                    rows={6}
                                    value={cssContent}
                                    onChange={(e) => setCssContent(e.target.value)}
                                    placeholder=".desktop-only { display: block; }"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                            </div>

                            {isMobileCustom && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile CSS</label>
                                    <textarea
                                        name="mobile_css_content"
                                        rows={6}
                                        value={mobileCssContent}
                                        onChange={(e) => setMobileCssContent(e.target.value)}
                                        placeholder=".mobile-only { display: block; }"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {isHtml && (
                        <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Images</label>
                            {editingSection ? (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                        {sectionImages.map((img) => (
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
                                                            onClick={() => handleSectionImageDelete(img.id, img.storage_path)}
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
                                    <p className="text-xs text-gray-500">Upload multiple images and use their IDs (e.g. <code>[[img-5]]</code>) in your HTML. Click the copy icon on an image to get its placeholder.</p>
                                </>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                                    <p className="text-sm font-medium text-primary-hover dark:text-primary mb-1">Save First to Upload Images</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">You must create and save the section before uploading multiple images.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {!isHtml && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Side Image</label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-zinc-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800/50 overflow-hidden relative">
                                        {previewImage ? (
                                            <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImageIcon className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload or drag & drop</p>
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
                                {previewImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="text-xs text-red-500 hover:text-red-600 font-medium self-end transition-colors"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </div>
                        </div>
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
                            {editingSection ? "Save Changes" : "Add Section"}
                        </button>
                    </div>

                    {isHtml && (
                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <Plus size={16} /> How to use Custom HTML & CSS
                            </h4>
                            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1.5 list-disc pl-4">
                                <li><strong>Mobile Layout:</strong> Check "Use different HTML/CSS for mobile" to provide a tailored experience for small screens.</li>
                                <li><strong>Images:</strong> Save the section first, then upload images. Hover over an image to see its ID (e.g., <code>[[img-1]]</code>).</li>
                                <li><strong>Usage:</strong> Paste the ID directly into your HTML: <code>&lt;img src=&quot;[[img-1]]&quot; /&gt;</code>. It will be automatically replaced with the actual image URL.</li>
                                <li><strong>CSS Scoping:</strong> CSS provided here only affects this specific section. Use <code>#section-{editingSection?.id || 'ID'}</code> for specific targeting if needed.</li>
                            </ul>
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
}
