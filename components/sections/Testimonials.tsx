"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, User } from "lucide-react";
import { Testimonial } from "@/app/admin/testimonials/actions";
import { createClient } from "@/utils/supabase/client";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const fetchTestimonials = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_enabled', true)
                .order('display_order', { ascending: true });
            
            if (data) setTestimonials(data);
        };
        fetchTestimonials();
    }, []);

    const nextSlide = useCallback(() => {
        if (isAnimating || testimonials.length <= 1) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, testimonials.length]);

    const prevSlide = useCallback(() => {
        if (isAnimating || testimonials.length <= 1) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, testimonials.length]);

    // Auto-play
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, testimonials.length]);

    if (testimonials.length === 0) return null;

    const current = testimonials[currentIndex];

    return (
        <section id="testimonials" className="py-[var(--section-py)] bg-gray-50 dark:bg-black/50 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 dark:opacity-10">
                <Quote className="absolute top-10 left-10 w-64 h-64 rotate-12" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Clients <span className="text-primary italic">Say</span>
                    </h2>
                    <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
                        Trusted by industry leaders and businesses for delivering excellence in strategy and execution.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative px-4">
                    {/* Carousel Container */}
                    <div className="relative overflow-hidden min-h-[400px] flex items-center">
                        <div 
                            className={`w-full transition-all duration-500 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                        >
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 relative">
                                <Quote className="text-primary/20 absolute top-8 right-8 w-16 h-16 sm:w-24 sm:h-24" />
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={20} 
                                                className={i < current.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-zinc-800"} 
                                            />
                                        ))}
                                    </div>

                                    <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-zinc-200 leading-relaxed mb-8 font-medium italic italic">
                                        "{current.content}"
                                    </blockquote>

                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-white dark:bg-zinc-800">
                                            {current.image_url ? (
                                                <img src={current.image_url} alt={current.name} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{current.name}</h4>
                                            {current.role && <p className="text-sm text-primary font-medium">{current.role}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {testimonials.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white hover:border-primary transition-all z-20 group"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white hover:border-primary transition-all z-20 group"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </>
                    )}

                    {/* Indicators */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-zinc-800 w-2 hover:bg-gray-400'}`}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
