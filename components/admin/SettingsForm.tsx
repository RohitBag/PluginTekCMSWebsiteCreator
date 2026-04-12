"use client";

import { Save, Plus, X, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { SiteSetting, updateSiteSettings } from "@/app/admin/settings/actions";
import { useRouter } from "next/navigation";
import { InputGroup, ImageUpload, KeyValueList, DynamicList, SocialMediaList } from "./SettingField";
import LogoBrandingSettings from "./LogoBrandingSettings";
import HeaderConfigEditor from "./HeaderConfigEditor";

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSetting[] }) {
    const [settings, setSettings] = useState<SiteSetting[]>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    // Helper to get value by key
    const getValue = (key: string) => settings.find(s => s.key === key)?.value;

    // Helper to update local state
    const updateLocalSetting = (key: string, newValue: any) => {
        setSettings(prev => {
            const exists = prev.some(s => s.key === key);
            if (exists) {
                return prev.map(s => s.key === key ? { ...s, value: newValue } : s);
            }
            // If it doesn't exist, add it to the state
            return [...prev, { key, value: newValue, label: key, type: 'text' } as SiteSetting];
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateSiteSettings(settings);
            if (result.success) {
                alert("Settings saved successfully!");
                router.refresh();
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

    return (
        <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Site Content</h2>
                    <p className="text-gray-500 mt-1">Manage global text and contact information.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="space-y-6">
                {/* Section: Global Branding */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                        Global Branding
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <InputGroup
                            label="Site Name"
                            value={getValue('site_name') || ''}
                            onChange={(v) => updateLocalSetting('site_name', v)}
                        />
                        <InputGroup
                            label="Copyright Text"
                            value={getValue('copyright_text') || ''}
                            onChange={(v) => updateLocalSetting('copyright_text', v)}
                        />
                        <InputGroup
                            label="Header Background Color"
                            type="color"
                            value={getValue('header_bg_color') || '#ffffff'}
                            onChange={(v) => updateLocalSetting('header_bg_color', v)}
                        />
                        <InputGroup
                            label="Footer Background Color"
                            type="color"
                            value={getValue('footer_bg_color') || '#18181b'}
                            onChange={(v) => updateLocalSetting('footer_bg_color', v)}
                        />
                        <InputGroup
                            label="Site Primary Color"
                            type="color"
                            value={getValue('site_primary_color') || '#f59e0b'}
                            onChange={(v) => updateLocalSetting('site_primary_color', v)}
                        />
                        <InputGroup
                            label="Site Secondary Color"
                            type="color"
                            value={getValue('site_secondary_color') || '#71717a'}
                            onChange={(v) => updateLocalSetting('site_secondary_color', v)}
                        />
                         <LogoBrandingSettings 
                            getValue={getValue} 
                            updateLocalSetting={updateLocalSetting} 
                        />

                        <div className="md:col-span-2 space-y-4">
                            <InputGroup
                                label="Site Font Family"
                                value={getValue('font_family') || 'Outfit'}
                                onChange={(val) => updateLocalSetting('font_family', val)}
                                type="select"
                                options={[
                                    { label: 'Outfit (Modern)', value: 'Outfit' },
                                    { label: 'Inter (Clean Sans)', value: 'Inter' },
                                    { label: 'Playfair Display (Premium)', value: 'Playfair Display' },
                                    { label: 'Montserrat (Geometric)', value: 'Montserrat' },
                                    { label: 'Roboto (Professional)', value: 'Roboto' },
                                    { label: 'Lora (Academic)', value: 'Lora' },
                                    { label: 'Open Sans (Accessible)', value: 'Open Sans' },
                                    { label: 'Lato (Friendly)', value: 'Lato' },
                                    { label: 'Manrope (Modern)', value: 'Manrope' },
                                    { label: 'Poppins (Soft)', value: 'Poppins' }
                                ]}
                            />
                            <InputGroup
                                label="Site Spacing (Whitespace)"
                                value={getValue('site_spacing') || 'spaced-out'}
                                onChange={(val) => updateLocalSetting('site_spacing', val)}
                                type="select"
                                options={[
                                    { label: 'Tight (Compact)', value: 'tight' },
                                    { label: 'Normal (Balanced)', value: 'normal' },
                                    { label: 'Spaced Out (Classic)', value: 'spaced-out' }
                                ]}
                            />
                            <KeyValueList
                                label="Compliance & Registration IDs"
                                values={getValue('compliance_info') || []}
                                onChange={(v) => updateLocalSetting('compliance_info', v)}
                                keyPlaceholder="Label (e.g. GST, MSME, License)"
                                valuePlaceholder="Value"
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Navigation */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                        Navigation Labels
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <InputGroup label="Home" value={getValue('nav_home_label') || ''} onChange={(v) => updateLocalSetting('nav_home_label', v)} />
                        <InputGroup label="Featured" value={getValue('nav_featured_label') || ''} onChange={(v) => updateLocalSetting('nav_featured_label', v)} />
                        <InputGroup label="Services" value={getValue('nav_services_label') || ''} onChange={(v) => updateLocalSetting('nav_services_label', v)} />
                        <InputGroup label="Portfolio" value={getValue('nav_portfolio_label') || ''} onChange={(v) => updateLocalSetting('nav_portfolio_label', v)} />
                        <InputGroup label="Contact" value={getValue('nav_contact_label') || ''} onChange={(v) => updateLocalSetting('nav_contact_label', v)} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                        Header Menu Layout & Design
                    </h3>
                    <HeaderConfigEditor 
                        config={getValue('header_menu_config') || {
                            items: {},
                            desktop: { fontSize: '16', alignment: 'right', fontFamily: 'Outfit' },
                            mobile: { fontSize: '14', alignment: 'left', fontFamily: 'Outfit' },
                            moreLabel: 'More'
                        }}
                        homeLayout={getValue('home_layout') || []}
                        onChange={(newConfig) => updateLocalSetting('header_menu_config', newConfig)}
                    />
                </div>

                {/* Section: Footer Branding */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                        Footer Branding
                    </h3>
                    <div className="grid gap-4">
                        <InputGroup
                            label="Footer Tagline"
                            value={getValue('footer_tagline') || ''}
                            onChange={(v) => updateLocalSetting('footer_tagline', v)}
                        />
                    </div>
                </div>

                {/* Section: Integrations */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                        Integrations & Widgets
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label="Chatbot Embed Code (Iframe)"
                            type="textarea"
                            placeholder='<iframe src="..." style="..."></iframe>'
                            value={getValue('chatbot_code') || ''}
                            onChange={(v) => updateLocalSetting('chatbot_code', v)}
                        />
                        <p className="text-xs text-gray-500 italic">
                            Paste the full iframe code provided by your chatbot provider (e.g. PluginTek). It will be rendered globally on every page.
                        </p>
                    </div>
                </div>

                {/* Relocation Notice */}
                <div className="bg-primary/5 dark:bg-amber-900/10 border border-primary/20 dark:border-amber-900/20 p-6 rounded-xl">
                    <h4 className="font-bold text-primary-hover dark:text-amber-200 mb-2">Looking for Section Content?</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Content for specific sections like <strong>Hero</strong>, <strong>About</strong>, <strong>Services</strong>, and <strong>Contact</strong> has been moved to the <a href="/admin/layout-editor" className="font-bold underline hover:text-primary-hover transition-colors">Layout Editor</a>. 
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-300 mt-2">
                        Navigate to the Layout Editor and click the <strong>Settings</strong> icon on any section to edit its text and images.
                    </p>
                </div>
            </div>
        </div>
    );
}

