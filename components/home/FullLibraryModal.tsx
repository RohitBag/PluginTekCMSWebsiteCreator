"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectCarousel from "./ProjectCarousel";
import { Project } from "@/app/admin/projects/actions";

type FullLibraryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    onProjectClick: (project: Project) => void;
    header?: string;
};

export default function FullLibraryModal({ 
    isOpen, 
    onClose, 
    projects, 
    onProjectClick,
    header 
}: FullLibraryModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            className="fixed inset-0 z-[9990] bg-white dark:bg-black overflow-y-auto"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-[1000] bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {header || "Full Project Library"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing all {projects.length} projects
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => onProjectClick(project)}
                            className="group bg-gray-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                        >
                            <div className="h-64 overflow-hidden relative">
                                {project.project_images && project.project_images.length > 0 ? (
                                    <ProjectCarousel
                                        images={project.project_images}
                                        title={project.title}
                                        description={project.description}
                                    />
                                ) : (
                                    <img
                                        src={project.thumbnail_url || '/placeholder.jpg'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <i className="fas fa-map-marker-alt text-primary"></i>
                                    {project.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Back to top */}
            <div className="py-12 text-center border-t border-gray-100 dark:border-zinc-800">
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-primary font-semibold hover:underline"
                >
                    Back to top
                </button>
            </div>
        </div>
    );
}
