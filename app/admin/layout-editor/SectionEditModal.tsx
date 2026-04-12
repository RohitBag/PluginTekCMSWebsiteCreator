"use client";

import { useRouter } from "next/navigation";
import { X, Save, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteSetting, updateSiteSettings } from "@/app/admin/settings/actions";
import { InputGroup, ImageUpload, KeyValueList, DynamicList, SocialMediaList } from "@/components/admin/SettingField";

interface SectionEditModalProps {
    sectionId: string;
    sectionLabel: string;
    isOpen: boolean;
    onClose: () => void;
    allSettings: SiteSetting[];
}

export default function SectionEditModal({ 
    sectionId, 
    sectionLabel, 
    isOpen, 
    onClose, 
    allSettings 
}: SectionEditModalProps) {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            if (sectionId.startsWith('custom_section_')) {
                router.push('/admin/sections');
                onClose();
                return;
            }
            setSettings(allSettings);
        }
    }, [isOpen, allSettings, sectionId, router, onClose]);

    if (!isOpen) return null;

    const getValue = (key: string) => settings.find(s => s.key === key)?.value;

    const updateLocalSetting = (key: string, newValue: any) => {
        setSettings(prev => {
            const exists = prev.some(s => s.key === key);
            if (exists) {
                return prev.map(s => s.key === key ? { ...s, value: newValue } : s);
            }
            return [...prev, { key, value: newValue, label: key, type: 'text' } as SiteSetting];
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateSiteSettings(settings);
            if (result.success) {
                alert("Settings saved successfully!");
                onClose();
            } else {
                alert("Error saving settings: " + result.message);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("An unexpected error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const renderFields = () => {
        switch (sectionId) {
            case 'hero':
                return (
                    <div className="space-y-6">
                        {/* Content */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Content</h4>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <InputGroup label="Badge / Pill Text (optional)" placeholder="e.g. Award Winning Firm" value={getValue('hero_badge_text') || ''} onChange={(v) => updateLocalSetting('hero_badge_text', v)} />
                                </div>
                                {getValue('hero_badge_text') && (
                                    <div className="w-1/3">
                                        <InputGroup label="Badge Theme Colour" type="color" value={getValue('hero_badge_color') || 'var(--primary)'} onChange={(v) => updateLocalSetting('hero_badge_color', v)} />
                                    </div>
                                )}
                            </div>
                            <InputGroup label="Hero Title" value={getValue('hero_title') || ''} onChange={(v) => updateLocalSetting('hero_title', v)} />
                            <InputGroup label="Highlight Word(s) (shown in colour)" value={getValue('hero_highlight_text') || ''} onChange={(v) => updateLocalSetting('hero_highlight_text', v)} />
                            <details className="mt-2 bg-gray-50 dark:bg-zinc-800/40 rounded-lg p-3 border border-gray-100 dark:border-zinc-800">
                                <summary className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    Highlight Word Options
                                </summary>
                                <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputGroup 
                                        label="Highlight Text Colour"
                                        type="color"
                                        value={getValue('hero_highlight_color') || 'var(--primary)'}
                                        onChange={(v) => updateLocalSetting('hero_highlight_color', v)}
                                    />
                                    <InputGroup 
                                        label="Make Italic?" 
                                        type="select" 
                                        value={getValue('hero_highlight_italic') || 'false'} 
                                        onChange={(v) => updateLocalSetting('hero_highlight_italic', v)} 
                                        options={[{label: 'No', value: 'false'}, {label: 'Yes', value: 'true'}]} 
                                    />
                                    <div className="col-span-1 md:col-span-2">
                                        <InputGroup
                                            label="Highlight Font Family"
                                            value={getValue('hero_highlight_font') || 'inherit'}
                                            onChange={(val) => updateLocalSetting('hero_highlight_font', val)}
                                            type="select"
                                            options={[
                                                { label: 'Inherit (Same as headings)', value: 'inherit' },
                                                { label: 'Playfair Display (Serif/Premium)', value: 'Playfair Display, serif' },
                                                { label: 'Lora (Serif)', value: 'Lora, serif' },
                                                { label: 'Caveat (Handwriting)', value: 'Caveat, cursive' },
                                                { label: 'Dancing Script', value: 'Dancing Script, cursive' },
                                                { label: 'Pacifico', value: 'Pacifico, cursive' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </details>
                            <InputGroup label="Hero Subtitle" type="textarea" value={getValue('hero_subtitle') || ''} onChange={(v) => updateLocalSetting('hero_subtitle', v)} />
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-left">CTA Buttons</h4>
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                    <InputGroup
                                        label="Corner Style"
                                        type="select"
                                        value={getValue('hero_cta_border_radius') || 'full'}
                                        onChange={(v) => updateLocalSetting('hero_cta_border_radius', v)}
                                        options={[
                                            { label: 'Rectangle (No Corners)', value: 'none' },
                                            { label: 'Slightly Rounded', value: 'md' },
                                            { label: 'Modern (Medium)', value: 'xl' },
                                            { label: 'Pill Shape (Full)', value: 'full' },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Primary Button Text" value={getValue('hero_cta_primary') || ''} onChange={(v) => updateLocalSetting('hero_cta_primary', v)} />
                                    <InputGroup label="Primary Button Link" placeholder="#contact" value={getValue('hero_cta_primary_link') || ''} onChange={(v) => updateLocalSetting('hero_cta_primary_link', v)} />
                                </div>
                                <InputGroup label="Primary Button Color" type="color" value={getValue('hero_cta_primary_color') || 'var(--primary)'} onChange={(v) => updateLocalSetting('hero_cta_primary_color', v)} />
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Secondary Button Text" value={getValue('hero_cta_secondary') || ''} onChange={(v) => updateLocalSetting('hero_cta_secondary', v)} />
                                    <InputGroup label="Secondary Button Link" placeholder="#portfolio" value={getValue('hero_cta_secondary_link') || ''} onChange={(v) => updateLocalSetting('hero_cta_secondary_link', v)} />
                                </div>
                                <InputGroup label="Secondary Button Color" type="color" value={getValue('hero_cta_secondary_color') || '#71717a'} onChange={(v) => updateLocalSetting('hero_cta_secondary_color', v)} />
                            </div>
                        </div>

                        {/* Layout */}
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Layout</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                <InputGroup
                                    label="Text Alignment"
                                    type="select"
                                    value={getValue('hero_text_align') || 'center'}
                                    onChange={(v) => updateLocalSetting('hero_text_align', v)}
                                    options={[
                                        { label: 'Center', value: 'center' },
                                        { label: 'Left', value: 'left' },
                                        { label: 'Right', value: 'right' },
                                    ]}
                                />
                                <InputGroup
                                    label="Heading Text Size"
                                    type="select"
                                    value={getValue('hero_title_size') || 'base'}
                                    onChange={(v) => updateLocalSetting('hero_title_size', v)}
                                    options={[
                                        { label: 'Small', value: 'small' },
                                        { label: 'Normal (Default)', value: 'base' },
                                        { label: 'Large', value: 'large' },
                                        { label: 'Extra Large', value: 'xl' },
                                    ]}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Mobile Height"
                                    type="select"
                                    value={getValue('hero_height') || 'full'}
                                    onChange={(v) => updateLocalSetting('hero_height', v)}
                                    options={[
                                        { label: 'Full Screen (100vh)', value: 'full' },
                                        { label: 'Large (80vh)', value: 'large' },
                                        { label: 'Medium (60vh)', value: 'medium' },
                                    ]}
                                />
                                <InputGroup
                                    label="Desktop Height"
                                    type="select"
                                    value={getValue('hero_height_desktop') || getValue('hero_height') || 'full'}
                                    onChange={(v) => updateLocalSetting('hero_height_desktop', v)}
                                    options={[
                                        { label: 'Full Screen (100vh)', value: 'full' },
                                        { label: 'Large (80vh)', value: 'large' },
                                        { label: 'Medium (60vh)', value: 'medium' },
                                    ]}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1 sm:col-span-2 space-y-4 text-left">
                                    <InputGroup
                                        label="Main Heading Color Mode"
                                        type="select"
                                        value={getValue('hero_text_color_mode') || 'auto'}
                                        onChange={(v) => updateLocalSetting('hero_text_color_mode', v)}
                                        options={[
                                            { label: 'Auto (Contrast Based)', value: 'auto' },
                                            { label: 'Custom Color', value: 'custom' },
                                        ]}
                                    />
                                    {getValue('hero_text_color_mode') === 'custom' && (
                                        <InputGroup
                                            label="Custom Heading Color"
                                            type="color"
                                            value={getValue('hero_text_color') || '#ffffff'}
                                            onChange={(v) => updateLocalSetting('hero_text_color', v)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hero Side Cutout */}
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Side Cutout Image (Optional)</h4>
                            <ImageUpload
                                label="PNG Cutout Image"
                                value={getValue('hero_cutout_image_url') || ''}
                                onUploadComplete={(url) => updateLocalSetting('hero_cutout_image_url', url)}
                                settingsKey="hero_cutout_image_url"
                            />
                            {(getValue('hero_cutout_image_url')) && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputGroup
                                            label="Cutout Position"
                                            type="select"
                                            value={getValue('hero_cutout_position') || 'right'}
                                            onChange={(v) => updateLocalSetting('hero_cutout_position', v)}
                                            options={[
                                                { label: 'Right Side', value: 'right' },
                                                { label: 'Left Side', value: 'left' },
                                            ]}
                                        />
                                        <InputGroup
                                            label="Cutout Image Size"
                                            type="select"
                                            value={getValue('hero_cutout_size') || 'large'}
                                            onChange={(v) => updateLocalSetting('hero_cutout_size', v)}
                                            options={[
                                                { label: 'Small', value: 'small' },
                                                { label: 'Medium', value: 'medium' },
                                                { label: 'Normal (Base)', value: 'base' },
                                                { label: 'Large (Default)', value: 'large' },
                                                { label: 'Extra Large', value: 'xl' },
                                            ]}
                                        />
                                        <InputGroup
                                            label="Show Floating Overlay Card?"
                                            type="select"
                                            value={getValue('hero_overlay_card_show') || 'false'}
                                            onChange={(v) => updateLocalSetting('hero_overlay_card_show', v)}
                                            options={[
                                                { label: 'No', value: 'false' },
                                                { label: 'Yes', value: 'true' },
                                            ]}
                                        />
                                    </div>

                                    {getValue('hero_overlay_card_show') === 'true' && (
                                        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-4 mt-2">
                                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overlay Card Details</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputGroup
                                                    label="Card Icon (FontAwesome Class)"
                                                    placeholder="fa-solid fa-certificate"
                                                    value={getValue('hero_overlay_card_icon') || 'fa-solid fa-certificate'}
                                                    onChange={(v) => updateLocalSetting('hero_overlay_card_icon', v)}
                                                />
                                                <InputGroup
                                                    label="Card Position"
                                                    type="select"
                                                    value={getValue('hero_overlay_card_position') || 'bottom-left'}
                                                    onChange={(v) => updateLocalSetting('hero_overlay_card_position', v)}
                                                    options={[
                                                        { label: 'Bottom Left', value: 'bottom-left' },
                                                        { label: 'Bottom Right', value: 'bottom-right' },
                                                        { label: 'Top Left', value: 'top-left' },
                                                        { label: 'Top Right', value: 'top-right' },
                                                    ]}
                                                />
                                            </div>
                                            <InputGroup
                                                label="Card Title (2 Words recommended)"
                                                placeholder="e.g. MD SPECIALIST"
                                                value={getValue('hero_overlay_card_title') || ''}
                                                onChange={(v) => updateLocalSetting('hero_overlay_card_title', v)}
                                            />
                                            <InputGroup
                                                label="Card Text (Short Description)"
                                                type="textarea"
                                                placeholder="e.g. Senior Consultant specializing in complex clinical interventions."
                                                value={getValue('hero_overlay_card_text') || ''}
                                                onChange={(v) => updateLocalSetting('hero_overlay_card_text', v)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Background */}
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Background</h4>
                            <InputGroup
                                label="Background Type"
                                type="select"
                                value={getValue('hero_bg_type') || 'image'}
                                onChange={(v) => updateLocalSetting('hero_bg_type', v)}
                                options={[
                                { label: 'Image', value: 'image' },
                                    { label: 'Gradient', value: 'gradient' },
                                    { label: 'Solid Colour', value: 'solid' },
                                    { label: 'Video URL', value: 'video' },
                                ]}
                            />
                            {(getValue('hero_bg_type')) === 'video' && (
                                <InputGroup 
                                    label="Background Video URL" 
                                    placeholder="e.g. https://example.com/video.mp4" 
                                    value={getValue('hero_bg_video_url') || ''} 
                                    onChange={(v) => updateLocalSetting('hero_bg_video_url', v)} 
                                />
                            )}
                            {((getValue('hero_bg_type') || 'image') === 'image' || getValue('hero_bg_type') === 'video') && (
                                <>
                                    {(getValue('hero_bg_type') || 'image') === 'image' && (
                                        <>
                                            <ImageUpload
                                                label="Background Image"
                                                value={getValue('hero_bg_image_url') || ''}
                                                onUploadComplete={(url) => updateLocalSetting('hero_bg_image_url', url)}
                                                settingsKey="hero_bg_image_url"
                                            />
                                            <InputGroup
                                                label="Scroll Background Image?"
                                                type="select"
                                                value={getValue('hero_bg_image_scroll') || 'false'}
                                                onChange={(v) => updateLocalSetting('hero_bg_image_scroll', v)}
                                                options={[
                                                    { label: 'No (Static)', value: 'false' },
                                                    { label: 'Yes (Infinite Horizontal Scroll)', value: 'true' },
                                                ]}
                                            />
                                        </>
                                    )}
                                    <div className="space-y-4 pt-2">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overlay Gradient Controls</h5>
                                        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Gradient Angle: {getValue('hero_overlay_gradient_angle') ?? 180}°
                                                </label>
                                                <input
                                                    type="range" min={0} max={360} step={5}
                                                    value={getValue('hero_overlay_gradient_angle') ?? 180}
                                                    onChange={(e) => updateLocalSetting('hero_overlay_gradient_angle', Number(e.target.value))}
                                                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <InputGroup 
                                                        label="Color Start" 
                                                        type="color" 
                                                        value={getValue('hero_overlay_color_start') || '#000000'} 
                                                        onChange={(v) => updateLocalSetting('hero_overlay_color_start', v)} 
                                                    />
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                            Opacity Start: {getValue('hero_overlay_opacity_start') ?? getValue('hero_overlay_opacity') ?? 60}%
                                                        </label>
                                                        <input
                                                            type="range" min={0} max={100} step={5}
                                                            value={getValue('hero_overlay_opacity_start') ?? getValue('hero_overlay_opacity') ?? 60}
                                                            onChange={(e) => updateLocalSetting('hero_overlay_opacity_start', Number(e.target.value))}
                                                            className="w-full accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <InputGroup 
                                                        label="Color End" 
                                                        type="color" 
                                                        value={getValue('hero_overlay_color_end') || '#000000'} 
                                                        onChange={(v) => updateLocalSetting('hero_overlay_color_end', v)} 
                                                    />
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                            Opacity End: {getValue('hero_overlay_opacity_end') ?? getValue('hero_overlay_opacity') ?? 60}%
                                                        </label>
                                                        <input
                                                            type="range" min={0} max={100} step={5}
                                                            value={getValue('hero_overlay_opacity_end') ?? getValue('hero_overlay_opacity') ?? 60}
                                                            onChange={(e) => updateLocalSetting('hero_overlay_opacity_end', Number(e.target.value))}
                                                            className="w-full accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {(getValue('hero_bg_type')) === 'gradient' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Gradient Start Colour" type="color" value={getValue('hero_bg_color_start') || '#1a1a2e'} onChange={(v) => updateLocalSetting('hero_bg_color_start', v)} />
                                    <InputGroup label="Gradient End Colour" type="color" value={getValue('hero_bg_color_end') || '#16213e'} onChange={(v) => updateLocalSetting('hero_bg_color_end', v)} />
                                </div>
                            )}
                            {(getValue('hero_bg_type')) === 'solid' && (
                                <InputGroup label="Background Colour" type="color" value={getValue('hero_bg_color_start') || '#1a1a2e'} onChange={(v) => updateLocalSetting('hero_bg_color_start', v)} />
                            )}
                        </div>
                    </div>
                );
            case 'about':
                return (
                    <div className="space-y-4">
                        <InputGroup label="Sub-label" value={getValue('about_sublabel') || ''} onChange={(v) => updateLocalSetting('about_sublabel', v)} />
                        <InputGroup label="About Title" value={getValue('about_title') || ''} onChange={(v) => updateLocalSetting('about_title', v)} />
                        <InputGroup label="Main Description" type="textarea" value={getValue('about_desc') || ''} onChange={(v) => updateLocalSetting('about_desc', v)} />
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Profile Subsection</h4>
                            <div className="space-y-3">
                                <InputGroup label="Profile Title" value={getValue('profile_title') || ''} onChange={(v) => updateLocalSetting('profile_title', v)} />
                                <InputGroup label="Profile Description" type="textarea" value={getValue('profile_desc') || ''} onChange={(v) => updateLocalSetting('profile_desc', v)} />
                            </div>
                        </div>
                        <ImageUpload label="About Image" value={getValue('about_image_url') || ''} onUploadComplete={(url) => updateLocalSetting('about_image_url', url)} settingsKey="about_image_url" />
                    </div>
                );
            case 'services':
                return (
                    <div className="space-y-4">
                        <InputGroup label="Main Header" value={getValue('services_header') || ''} onChange={(v) => updateLocalSetting('services_header', v)} />
                        <InputGroup label="Sub-label" value={getValue('services_sublabel') || ''} onChange={(v) => updateLocalSetting('services_sublabel', v)} />
                    </div>
                );
            case 'portfolio':
                return (
                    <div className="space-y-4">
                        <InputGroup label="Main Header" value={getValue('portfolio_header') || ''} onChange={(v) => updateLocalSetting('portfolio_header', v)} />
                        <InputGroup label="Sub-label" value={getValue('portfolio_sublabel') || ''} onChange={(v) => updateLocalSetting('portfolio_sublabel', v)} />
                    </div>
                );
            case 'contact':
                return (
                    <div className="space-y-4">
                        <InputGroup label="Main Header" value={getValue('contact_header') || ''} onChange={(v) => updateLocalSetting('contact_header', v)} />
                        <InputGroup label="Sub-label" value={getValue('contact_sublabel') || ''} onChange={(v) => updateLocalSetting('contact_sublabel', v)} />
                        <DynamicList label="Phone Numbers" values={getValue('contact_phones') || []} onChange={(v) => updateLocalSetting('contact_phones', v)} />
                        <DynamicList label="Email Addresses" values={getValue('contact_emails') || []} onChange={(v) => updateLocalSetting('contact_emails', v)} />
                        <InputGroup label="Website URL" value={getValue('website_url') || ''} onChange={(v) => updateLocalSetting('website_url', v)} />
                        <SocialMediaList values={getValue('social_links') || []} onChange={(v) => updateLocalSetting('social_links', v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Phone Card Title" value={getValue('contact_card_phone_title') || ''} onChange={(v) => updateLocalSetting('contact_card_phone_title', v)} />
                            <InputGroup label="Email Card Title" value={getValue('contact_card_email_title') || ''} onChange={(v) => updateLocalSetting('contact_card_email_title', v)} />
                        </div>
                        <InputGroup label="Address Heading" placeholder="e.g. Clinic Location:" value={getValue('contact_clinic_label') || ''} onChange={(v) => updateLocalSetting('contact_clinic_label', v)} />
                        <InputGroup label="Address" type="textarea" value={getValue('contact_address') || ''} onChange={(v) => updateLocalSetting('contact_address', v)} />
                        <InputGroup label="Google Maps URL" value={getValue('contact_map_url') || ''} onChange={(v) => updateLocalSetting('contact_map_url', v)} />
                    </div>
                );
            default:
                if (sectionId.startsWith('custom_section_')) {
                    return (
                        <div className="flex flex-col items-center justify-center p-8 space-y-4">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-gray-500 font-medium">Redirecting to Custom Sections manager...</p>
                        </div>
                    );
                }
                return <p className="text-gray-500">No specific settings available for this section.</p>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit {sectionLabel}</h2>
                        <p className="text-sm text-gray-500">Configure content for this section.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {renderFields()}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-800/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-zinc-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
