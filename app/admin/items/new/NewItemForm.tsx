"use client";
import { useState } from "react";
import Link from "next/link";
import { Upload, Search, LayoutPanelLeft } from "lucide-react";
import { createItem } from "../actions";
import SEOAssistant from "@/components/admin/SEOAssistant";

export default function NewItemForm({ siteName }: { siteName: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
    
    // SEO State
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [itemDesc, setItemDesc] = useState("");

    return (
        <form
            action={async (formData) => {
                setIsSubmitting(true);
                formData.append('seo_title', seoTitle);
                formData.append('seo_description', seoDescription);
                formData.append('description', itemDesc);
                await createItem(formData);
            }}
            className="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
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
                    Item Details
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

            {activeTab === 'content' ? (
                <>
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="e.g. Modern Apartment in City Center"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price (Values in INR)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="e.g. 15000000"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                            <p className="text-xs text-gray-500">Enter simple whole numbers (e.g. 10000000 for 1 Cr).</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={itemDesc}
                            onChange={(e) => setItemDesc(e.target.value)}
                            placeholder="Briefly describe the item..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Mumbai, India"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Call to Action</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Button Label</label>
                                <input
                                    type="text"
                                    name="action_label"
                                    defaultValue="Contact Us"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Button Action / URL</label>
                                <input
                                    type="text"
                                    name="action_url"
                                    placeholder="e.g. tel:+919876543210 or /contact"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Gallery Images</h3>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                />
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Click or drag images here to upload
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Recommended size: 1920x1080px</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <SEOAssistant
                    title={seoTitle}
                    description={seoDescription}
                    content={itemDesc}
                    siteName={siteName}
                    onUpdate={(field: 'title' | 'description', val: string) => {
                        if (field === 'title') setSeoTitle(val);
                        else setSeoDescription(val);
                    }}
                />
            )}

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isSubmitting ? "Creating Item..." : "Create Item"}
                </button>
            </div>
        </form>
    );
}
