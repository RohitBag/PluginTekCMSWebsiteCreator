"use client";

import { Save, Plus, X, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { uploadBrandingImage } from "@/app/admin/settings/actions";

export function ImageUpload({ 
    label, 
    value, 
    onUploadComplete, 
    settingsKey 
}: { 
    label: string; 
    value: string; 
    onUploadComplete: (url: string) => void; 
    settingsKey: string 
}) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('imageFile', file);
        formData.append('key', settingsKey);

        const result = await uploadBrandingImage(formData);
        setIsUploading(false);

        if (result.success && result.url) {
            onUploadComplete(result.url);
        } else {
            alert(result.message || "Failed to upload image");
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex items-center gap-4">
                {value && (
                    <div className="relative w-16 h-16 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 p-1 group">
                        <img src={value} alt="Preview" className="w-full h-full object-contain" />
                        <button 
                            type="button"
                            onClick={() => onUploadComplete('')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
                <div className="flex-1">
                    <label className={`
                        flex flex-col items-center justify-center w-full h-16 
                        border-2 border-dashed border-gray-300 dark:border-zinc-700 
                        rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 
                        transition-all overflow-hidden relative
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        <div className="flex flex-col items-center justify-center py-2">
                            {isUploading ? (
                                <Loader2 className="animate-spin text-primary" size={20} />
                            ) : (
                                <>
                                    <Upload className="text-gray-400 mb-1" size={20} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload</p>
                                </>
                            )}
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleUpload} 
                            disabled={isUploading}
                        />
                    </label>
                </div>
            </div>
            <input 
                type="text"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 dark:text-gray-400 focus:ring-1 focus:ring-primary outline-none"
                value={value}
                onChange={(e) => onUploadComplete(e.target.value)}
                placeholder="Or paste URL here..."
            />
        </div>
    );
}

export function InputGroup({ 
    label, 
    value, 
    onChange, 
    type = "text", 
    placeholder,
    options 
}: { 
    label: string; 
    value: string; 
    onChange: (val: string) => void; 
    type?: "text" | "textarea" | "color" | "select"; 
    placeholder?: string;
    options?: { label: string; value: string }[];
}) {
    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            {type === "textarea" ? (
                <textarea
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                    rows={3}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            ) : type === "select" ? (
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ) : type === "color" ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            className="w-12 h-10 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 cursor-pointer p-1"
                            value={value || "#ffffff"}
                            onInput={(e) => onChange((e.target as HTMLInputElement).value)}
                        />
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white font-mono text-sm uppercase"
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#HEXCODE"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: 'White', hex: '#ffffff' },
                            { name: 'Zinc', hex: '#18181b' },
                            { name: 'Slate', hex: '#0f172a' },
                            { name: 'Amber', hex: 'var(--primary)' },
                            { name: 'Red', hex: '#ef4444' },
                            { name: 'Blue', hex: '#3b82f6' }
                        ].map((preset) => (
                            <button
                                key={preset.hex}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChange(preset.hex);
                                }}
                                title={preset.name}
                                className={`w-6 h-6 rounded-full border border-gray-300 dark:border-zinc-600 shadow-sm hover:scale-110 transition-transform`}
                                style={{ backgroundColor: preset.hex }}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
}

export function KeyValueList({ label, values, onChange, keyPlaceholder = "Label", valuePlaceholder = "Value" }: { label: string; values: { label: string; value: string }[]; onChange: (vals: { label: string; value: string }[]) => void; keyPlaceholder?: string; valuePlaceholder?: string }) {
    const addItem = () => onChange([...values, { label: "", value: "" }]);
    const removeItem = (index: number) => onChange(values.filter((_, i) => i !== index));
    const updateItem = (index: number, field: "label" | "value", newVal: string) => {
        const newItems = [...values];
        newItems[index] = { ...newItems[index], [field]: newVal };
        onChange(newItems);
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="space-y-2">
                {values.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item.label}
                            onChange={(e) => updateItem(index, "label", e.target.value)}
                            className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            placeholder={keyPlaceholder}
                        />
                        <input
                            type="text"
                            value={item.value}
                            onChange={(e) => updateItem(index, "value", e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            placeholder={valuePlaceholder}
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-sm text-primary-hover hover:text-amber-700 font-medium px-2 py-1 rounded hover:bg-primary/5 dark:hover:bg-amber-900/10 transition-colors"
                >
                    <Plus size={16} />
                    Add Item
                </button>
            </div>
        </div>
    );
}

export function DynamicList({ label, values, onChange }: { label: string; values: string[]; onChange: (vals: string[]) => void }) {
    const addItem = () => onChange([...values, ""]);
    const removeItem = (index: number) => onChange(values.filter((_, i) => i !== index));
    const updateItem = (index: number, value: string) => {
        const newItems = [...values];
        newItems[index] = value;
        onChange(newItems);
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="space-y-2">
                {values.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            placeholder={`Add ${label.slice(0, -1).toLowerCase()}...`}
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-sm text-primary-hover hover:text-amber-700 font-medium px-2 py-1 rounded hover:bg-primary/5 dark:hover:bg-amber-900/10 transition-colors"
                >
                    <Plus size={16} />
                    Add Another
                </button>
            </div>
        </div>
    );
}

export function SocialMediaList({ values, onChange }: { values: { platform: string; url: string }[]; onChange: (vals: { platform: string; url: string }[]) => void }) {
    const addItem = () => onChange([...values, { platform: "", url: "" }]);
    const removeItem = (index: number) => onChange(values.filter((_, i) => i !== index));
    const updateItem = (index: number, field: "platform" | "url", newVal: string) => {
        const newItems = [...values];
        newItems[index] = { ...newItems[index], [field]: newVal };
        onChange(newItems);
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Social Media Handles</label>
            <div className="space-y-2">
                {values.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <select
                            value={item.platform}
                            onChange={(e) => updateItem(index, "platform", e.target.value)}
                            className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                        >
                            <option value="" disabled>Select Platform</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="YouTube">YouTube</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                        <input
                            type="text"
                            value={item.url}
                            onChange={(e) => updateItem(index, "url", e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            placeholder="Profile URL"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-sm text-primary-hover hover:text-amber-700 font-medium px-2 py-1 rounded hover:bg-primary/5 dark:hover:bg-amber-900/10 transition-colors"
                >
                    <Plus size={16} />
                    Add Social Link
                </button>
            </div>
        </div>
    );
}
