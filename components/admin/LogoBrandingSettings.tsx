"use client";

import { Settings2, ChevronDown, ChevronUp, Type, ImageIcon } from "lucide-react";
import { useState } from "react";
import { InputGroup, ImageUpload } from "./SettingField";

interface LogoBrandingSettingsProps {
    getValue: (key: string) => string;
    updateLocalSetting: (key: string, value: any) => void;
}

export default function LogoBrandingSettings({ getValue, updateLocalSetting }: LogoBrandingSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const logoType = getValue('logo_type') || 'image';

    const fonts = [
        { label: 'Outfit (Modern)', value: 'Outfit' },
        { label: 'Inter (Clean Sans)', value: 'Inter' },
        { label: 'Playfair Display (Premium)', value: 'Playfair Display' },
        { label: 'Montserrat (Geometric)', value: 'Montserrat' },
        { label: 'Roboto (Professional)', value: 'Roboto' },
        { label: 'Manrope (Modern)', value: 'Manrope' },
        { label: 'Poppins (Soft)', value: 'Poppins' },
        { label: 'Cinzel (Elegant Serif)', value: 'Cinzel' },
        { label: 'Dancing Script (Handwritten)', value: 'Dancing Script' },
    ];

    const weights = [
        { label: 'Light', value: '300' },
        { label: 'Regular', value: '400' },
        { label: 'Medium', value: '500' },
        { label: 'Semi-Bold', value: '600' },
        { label: 'Bold', value: '700' },
        { label: 'Extra-Bold', value: '800' },
    ];

    return (
        <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-4 mb-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary-hover dark:text-primary hover:text-amber-700 transition-colors"
                >
                    <Settings2 size={16} />
                    Logo Branding & Design
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => updateLocalSetting('logo_type', 'image')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${logoType === 'image' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-gray-500'}`}
                    >
                        <ImageIcon size={14} />
                        Image
                    </button>
                    <button
                        type="button"
                        onClick={() => updateLocalSetting('logo_type', 'text')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${logoType === 'text' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-gray-500'}`}
                    >
                        <Type size={14} />
                        Text
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {logoType === 'image' ? (
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <ImageUpload
                                    label="Site Logo (Light/Default)"
                                    value={getValue('site_logo_url') || ''}
                                    onUploadComplete={(url) => updateLocalSetting('site_logo_url', url)}
                                    settingsKey="site_logo_url"
                                />
                                <ImageUpload
                                    label="Site Logo (Inverted/Dark)"
                                    value={getValue('site_logo_inverted_url') || ''}
                                    onUploadComplete={(url) => updateLocalSetting('site_logo_inverted_url', url)}
                                    settingsKey="site_logo_inverted_url"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Light Mode Filters */}
                                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        Light Mode logo Filters
                                    </h4>
                                    <div className="grid gap-3">
                                        <InputGroup
                                            label="Brightness"
                                            value={getValue('logo_light_brightness') || '1'}
                                            onChange={(v) => updateLocalSetting('logo_light_brightness', v)}
                                            placeholder="e.g. 1.2 or 120%"
                                        />
                                        <InputGroup
                                            label="Grayscale"
                                            value={getValue('logo_light_grayscale') || '0'}
                                            onChange={(v) => updateLocalSetting('logo_light_grayscale', v)}
                                            placeholder="e.g. 0.5 or 50%"
                                        />
                                        <InputGroup
                                            label="Drop Shadow"
                                            value={getValue('logo_light_drop_shadow') || 'none'}
                                            onChange={(v) => updateLocalSetting('logo_light_drop_shadow', v)}
                                            placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
                                        />
                                    </div>
                                </div>

                                {/* Dark Mode Filters */}
                                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                                        Dark Mode Logo Filters
                                    </h4>
                                    <div className="grid gap-3">
                                        <InputGroup
                                            label="Brightness"
                                            value={getValue('logo_dark_brightness') || '1'}
                                            onChange={(v) => updateLocalSetting('logo_dark_brightness', v)}
                                            placeholder="e.g. 1.2 or 120%"
                                        />
                                        <InputGroup
                                            label="Grayscale"
                                            value={getValue('logo_dark_grayscale') || '0'}
                                            onChange={(v) => updateLocalSetting('logo_dark_grayscale', v)}
                                            placeholder="e.g. 0.5 or 50%"
                                        />
                                        <InputGroup
                                            label="Drop Shadow"
                                            value={getValue('logo_dark_drop_shadow') || 'none'}
                                            onChange={(v) => updateLocalSetting('logo_dark_drop_shadow', v)}
                                            placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Global Text Settings */}
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    General Text Settings
                                </h4>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="md:col-span-2">
                                        <InputGroup
                                            label="Logo Text"
                                            value={getValue('logo_text') || ''}
                                            onChange={(v) => updateLocalSetting('logo_text', v)}
                                        />
                                    </div>
                                    <InputGroup
                                        label="Font Family"
                                        type="select"
                                        options={fonts}
                                        value={getValue('logo_text_font') || 'Outfit'}
                                        onChange={(v) => updateLocalSetting('logo_text_font', v)}
                                    />
                                    <InputGroup
                                        label="Font Weight"
                                        type="select"
                                        options={weights}
                                        value={getValue('logo_text_weight') || '700'}
                                        onChange={(v) => updateLocalSetting('logo_text_weight', v)}
                                    />
                                    <InputGroup
                                        label="Font Size (px)"
                                        value={getValue('logo_text_size') || '24'}
                                        onChange={(v) => updateLocalSetting('logo_text_size', v)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Light Mode Colors */}
                                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        Light Mode Styling
                                    </h4>
                                    <div className="grid gap-3">
                                        <InputGroup
                                            label="Text Color"
                                            type="color"
                                            value={getValue('logo_text_color_light') || '#000000'}
                                            onChange={(v) => updateLocalSetting('logo_text_color_light', v)}
                                        />
                                        <InputGroup
                                            label="Text Shadow"
                                            value={getValue('logo_text_shadow_light') || 'none'}
                                            onChange={(v) => updateLocalSetting('logo_text_shadow_light', v)}
                                            placeholder="e.g. 2px 2px 4px rgba(0,0,0,0.2)"
                                        />
                                    </div>
                                </div>

                                {/* Dark Mode Colors */}
                                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                                        Dark Mode Styling
                                    </h4>
                                    <div className="grid gap-3">
                                        <InputGroup
                                            label="Text Color"
                                            type="color"
                                            value={getValue('logo_text_color_dark') || '#ffffff'}
                                            onChange={(v) => updateLocalSetting('logo_text_color_dark', v)}
                                        />
                                        <InputGroup
                                            label="Text Shadow"
                                            value={getValue('logo_text_shadow_dark') || 'none'}
                                            onChange={(v) => updateLocalSetting('logo_text_shadow_dark', v)}
                                            placeholder="e.g. 2px 2px 4px rgba(0,0,0,0.5)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Favicon Settings */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Settings2 size={16} className="text-primary" />
                        Favicon Configuration
                    </h3>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => updateLocalSetting('favicon_type', 'image')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${getValue('favicon_type') !== 'icon' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-gray-500'}`}
                        >
                            <ImageIcon size={14} />
                            Image
                        </button>
                        <button
                            type="button"
                            onClick={() => updateLocalSetting('favicon_type', 'icon')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${getValue('favicon_type') === 'icon' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-gray-500'}`}
                        >
                            <Type size={14} />
                            Icon
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {getValue('favicon_type') === 'icon' ? (
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                            <div className="grid gap-4 md:grid-cols-2">
                                <InputGroup
                                    label="FontAwesome Icon Class"
                                    value={getValue('favicon_icon') || 'fa-solid fa-star'}
                                    onChange={(v) => updateLocalSetting('favicon_icon', v)}
                                    placeholder="e.g. fa-solid fa-house"
                                />
                                <InputGroup
                                    label="Icon Color"
                                    type="color"
                                    value={getValue('favicon_icon_color') || '#f59e0b'}
                                    onChange={(v) => updateLocalSetting('favicon_icon_color', v)}
                                />
                            </div>
                            <p className="mt-3 text-[10px] text-gray-400 italic">
                                Tip: Use classes from FontAwesome 6 (e.g., fa-solid fa-palette, fa-brands fa-react)
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 shadow-inner">
                            <ImageUpload
                                label="Upload Favicon Image (PNG/ICO/SVG)"
                                value={getValue('favicon_url') || ''}
                                onUploadComplete={(url) => updateLocalSetting('favicon_url', url)}
                                settingsKey="favicon_url"
                            />
                            <p className="mt-2 text-[10px] text-gray-400">
                                Recommended size: 32x32px or 64x64px. SVG recommended for best quality.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
