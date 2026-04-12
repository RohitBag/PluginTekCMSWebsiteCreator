"use client";

import { useState } from "react";
import ProjectCarousel from "./ProjectCarousel";
import ProjectModal from "./ProjectModal";
import VideoModal from "./VideoModal";
import FullLibraryModal from "./FullLibraryModal";
import { ProjectImage } from "@/app/admin/projects/actions";
import { getEmbedInfo, EmbedType } from "@/utils/embed";

type Project = {
    id: number;
    title: string;
    location: string;
    description: string;
    thumbnail_url: string;
    project_images?: ProjectImage[];
};

export default function PortfolioClient({ 
    projects, 
    header, 
    sublabel 
}: { 
    projects: Project[]; 
    header?: string; 
    sublabel?: string; 
}) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);
    const [activeEmbedType, setActiveEmbedType] = useState<EmbedType>('youtube');
    const [activeVideoTitle, setActiveVideoTitle] = useState<string>("");
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);

    const handleProjectClick = (project: Project) => {
        const embedInfo = getEmbedInfo(project.description);
        if (embedInfo) {
            setActiveEmbedUrl(embedInfo.url);
            setActiveEmbedType(embedInfo.type);
            setActiveVideoTitle(project.title);
        } else {
            setSelectedProject(project);
        }
    };

    const initialProjectsCount = 6;
    const hasMoreProjects = projects.length > initialProjectsCount;

    return (
        <>
            <section id="portfolio" className="section-spacing bg-white dark:bg-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary uppercase tracking-widest font-semibold block mb-2">{sublabel || "Our Work"}</span>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{header || "Featured Projects"}</h2>
                        
                        {/* Explore full library link - opens modal now */}
                        {(header?.toLowerCase().includes('library') || header?.toLowerCase().includes('video') || header?.toLowerCase().includes('gallery') || hasMoreProjects) && (
                            <button 
                                onClick={() => setIsLibraryModalOpen(true)}
                                className="inline-block mt-4 text-primary font-semibold hover:text-primary-hover transition-colors"
                            >
                                Explore full library <i className="fas fa-arrow-right ml-1"></i>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.slice(0, initialProjectsCount).map((project) => (
                            <div
                                key={project.id}
                                onClick={() => handleProjectClick(project)}
                                className="group bg-gray-50 dark:bg-black rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    {/* Use carousel if project has images, otherwise fallback to thumbnail */}
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
            </section>

            {/* Library Modal */}
            <FullLibraryModal
                isOpen={isLibraryModalOpen}
                onClose={() => setIsLibraryModalOpen(false)}
                projects={projects}
                onProjectClick={handleProjectClick}
                header={header}
            />

            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                    title={selectedProject.title}
                    location={selectedProject.location}
                    description={selectedProject.description}
                    images={selectedProject.project_images || []}
                />
            )}

            {/* Video Modal */}
            <VideoModal
                isOpen={!!activeEmbedUrl}
                onClose={() => setActiveEmbedUrl(null)}
                embedUrl={activeEmbedUrl || ""}
                embedType={activeEmbedType}
                title={activeVideoTitle}
            />
        </>
    );
}
