"use client";

import { Plus, Trash2, Edit2, Image as ImageIcon, X, Loader2, Upload, LayoutPanelLeft, Search } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import GalleryManager from "@/components/admin/GalleryManager";
import { Project, upsertProject, deleteProject, addGalleryImages } from "@/app/admin/projects/actions";
import { useRouter } from "next/navigation";
import SEOAssistant from "./SEOAssistant";

export default function ProjectsManager({ initialProjects, siteName }: { initialProjects: Project[], siteName: string }) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    // For new project gallery images
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
    
    // SEO State
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [projectDesc, setProjectDesc] = useState("");

    const router = useRouter();

    const handleOpen = (project?: Project) => {
        setEditingProject(project || null);
        setPreviewImage(project?.thumbnail_url || null);
        setSeoTitle(project?.seo_title || "");
        setSeoDescription(project?.seo_description || "");
        setProjectDesc(project?.description || "");
        setNewGalleryFiles([]);
        setNewGalleryPreviews([]);
        setActiveTab('content');
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        setPreviewImage(null);
        setNewGalleryFiles([]);
        setNewGalleryPreviews([]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const filesArray = Array.from(files);
        setNewGalleryFiles(prev => [...prev, ...filesArray]);

        // Create previews
        const previews = filesArray.map(file => URL.createObjectURL(file));
        setNewGalleryPreviews(prev => [...prev, ...previews]);

        // Reset input
        e.target.value = '';
    };

    const removeGalleryPreview = (index: number) => {
        setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setNewGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        if (editingProject) {
            formData.append('id', editingProject.id.toString());
            formData.append('existingImage', editingProject.thumbnail_url || '');
        }

        formData.append('seo_title', seoTitle);
        formData.append('seo_description', seoDescription);
        formData.append('description', projectDesc);

        const result = await upsertProject(formData);

        if (result.success) {
            // If this is a new project and we have gallery images, upload them
            if (!editingProject && newGalleryFiles.length > 0 && result.projectId) {
                await addGalleryImages(result.projectId, newGalleryFiles);
            }
            handleClose();
            router.refresh();
        } else {
            alert(result.message);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this gallery item?")) return;
        setIsLoading(true);
        const result = await deleteProject(id);
        setIsLoading(false);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h2>
                    <p className="text-gray-500 mt-1">Manage your gallery items and upload photos.</p>
                </div>
                <button
                    onClick={() => handleOpen()}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Gallery Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProjects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No gallery items found. Add one to showcase your work.
                    </div>
                ) : (
                    initialProjects.map((project) => (
                        <div key={project.id} className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="relative h-48 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                {project.thumbnail_url && project.thumbnail_url !== '/placeholder.jpg' ? (
                                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400"><ImageIcon size={32} /></div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpen(project)}
                                        className="p-2 bg-white/90 dark:bg-black/90 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-500 shadow-sm backdrop-blur-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-white/90 dark:bg-black/90 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-500 shadow-sm backdrop-blur-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {project.project_images && project.project_images.length > 0 && (
                                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                        {project.project_images.length} images
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{project.location}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingProject ? "Edit Gallery Item" : "Add New Gallery Item"}
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
                        Basic Info
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    defaultValue={editingProject?.title}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                <input
                                    name="location"
                                    type="text"
                                    defaultValue={editingProject?.location}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={projectDesc}
                                    onChange={(e) => setProjectDesc(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-2 italic">Tip: Pasting a YouTube or Vimeo link here will automatically priority it as a Video project.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <SEOAssistant
                            title={seoTitle}
                            description={seoDescription}
                            content={projectDesc}
                            siteName={siteName}
                            onUpdate={(field, val) => {
                                if (field === 'title') setSeoTitle(val);
                                else setSeoDescription(val);
                            }}
                        />
                    )}

                    {/* Gallery Manager - For existing projects */}
                    {editingProject && (
                        <GalleryManager
                            projectId={editingProject.id}
                            projectTitle={editingProject.title}
                            initialImages={editingProject.project_images || []}
                        />
                    )}

                    {/* Gallery Images for NEW projects */}
                    {!editingProject && (
                        <div className="mt-6 border-t border-gray-200 dark:border-zinc-700 pt-6">
                            <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Gallery Images ({newGalleryPreviews.length})
                                </h4>
                                <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-md">
                                    <Plus size={18} />
                                    Add Images
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleGalleryFilesChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {newGalleryPreviews.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800">
                                    <Upload size={32} className="mx-auto mb-2 opacity-50" />
                                    No gallery images yet. Click "Add Images" above!
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {newGalleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-zinc-700">
                                            <div className="aspect-square bg-gray-100 dark:bg-zinc-800">
                                                <img
                                                    src={preview}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-bold">
                                                {index + 1}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryPreview(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                                These images will be uploaded when you add the project.
                            </p>
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
                            {editingProject ? "Save Changes" : "Add Gallery Item"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
