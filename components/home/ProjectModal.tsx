"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ProjectImage } from "@/app/admin/projects/actions";

type ProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    location: string;
    description?: string;
    images: ProjectImage[];
};

export default function ProjectModal({ isOpen, onClose, title, location, description, images }: ProjectModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && sortedImages.length > 1) {
                setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
            }
            if (e.key === "ArrowRight" && sortedImages.length > 1) {
                setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose, sortedImages.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.98)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Close Button - Top Right */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: isMobile ? '12px' : '20px',
                    right: isMobile ? '12px' : '20px',
                    zIndex: 10000,
                    padding: isMobile ? '8px' : '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <X size={isMobile ? 20 : 28} />
            </button>

            {/* Image Counter */}
            {sortedImages.length > 1 && (
                <div style={{
                    position: 'absolute',
                    top: isMobile ? '12px' : '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    borderRadius: '20px',
                    fontSize: isMobile ? '12px' : '14px',
                    zIndex: 10000,
                }}>
                    {currentIndex + 1} / {sortedImages.length}
                </div>
            )}

            {/* Main Image Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: isMobile ? '50px 40px 10px 40px' : '60px 80px 20px 80px',
                minHeight: 0,
            }}>
                {sortedImages.length > 0 ? (
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* Image */}
                        <img
                            src={sortedImages[currentIndex].image_url}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 200px)',
                                objectFit: 'contain',
                                borderRadius: isMobile ? '4px' : '8px',
                            }}
                        />

                        {/* Text Overlay - On Image */}
                        <div style={{
                            position: 'absolute',
                            bottom: isMobile ? '0' : '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isMobile ? '100%' : 'auto',
                            maxWidth: isMobile ? '100%' : '90%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent)',
                            padding: isMobile ? '30px 16px 16px 16px' : '40px 24px 24px 24px',
                            borderBottomLeftRadius: isMobile ? '4px' : '8px',
                            borderBottomRightRadius: isMobile ? '4px' : '8px',
                            textAlign: isMobile ? 'center' : 'left',
                        }}>
                            <h2 style={{
                                color: 'white',
                                fontSize: isMobile ? '16px' : '24px',
                                fontWeight: 'bold',
                                marginBottom: isMobile ? '4px' : '8px'
                            }}>
                                {title}
                            </h2>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isMobile ? 'center' : 'flex-start',
                                gap: '6px',
                                color: 'rgba(255,255,255,0.8)',
                                marginBottom: isMobile ? '4px' : '8px',
                                fontSize: isMobile ? '12px' : '14px',
                            }}>
                                <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i>
                                <span>{location}</span>
                            </div>
                            {description && !isMobile && (
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ color: 'white', fontSize: '18px' }}>No images available</div>
                )}

                {/* Left Arrow */}
                {sortedImages.length > 1 && (
                    <button
                        onClick={prevSlide}
                        style={{
                            position: 'absolute',
                            left: isMobile ? '4px' : '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 100,
                            padding: isMobile ? '8px' : '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ChevronLeft size={isMobile ? 20 : 32} />
                    </button>
                )}

                {/* Right Arrow */}
                {sortedImages.length > 1 && (
                    <button
                        onClick={nextSlide}
                        style={{
                            position: 'absolute',
                            right: isMobile ? '4px' : '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 100,
                            padding: isMobile ? '8px' : '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ChevronRight size={isMobile ? 20 : 32} />
                    </button>
                )}
            </div>

            {/* Thumbnail Strip */}
            {sortedImages.length > 1 && (
                <div style={{
                    flexShrink: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: isMobile ? '8px' : '16px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: isMobile ? '6px' : '12px',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {sortedImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                flexShrink: 0,
                                width: isMobile ? '50px' : '70px',
                                height: isMobile ? '50px' : '70px',
                                borderRadius: isMobile ? '4px' : '8px',
                                overflow: 'hidden',
                                border: index === currentIndex ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.3)',
                                opacity: index === currentIndex ? 1 : 0.6,
                                cursor: 'pointer',
                                padding: 0,
                                background: 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            <img
                                src={image.image_url}
                                alt={`Thumbnail ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
