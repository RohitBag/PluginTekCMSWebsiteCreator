'use client'

import { useState } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, Settings } from "lucide-react";
import { updateHomeLayout } from "./actions";
import SectionEditModal from "./SectionEditModal";
import { SiteSetting } from "../settings/actions";

interface SectionConfig {
    id: string;
    type: string;
    label: string;
    enabled: boolean;
    pageId?: number | null;
}

export default function LayoutEditorPage({ 
    initialLayout, 
    allSettings 
}: { 
    initialLayout: SectionConfig[]; 
    allSettings: SiteSetting[];
}) {
    const [layout, setLayout] = useState<SectionConfig[]>(initialLayout || []);
    const [isSaving, setIsSaving] = useState(false);
    const [editingSection, setEditingSection] = useState<SectionConfig | null>(null);
    const [showOtherPages, setShowOtherPages] = useState(false);

    const isVisible = (section: SectionConfig) => {
        return showOtherPages || !section.pageId;
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newLayout = [...layout];
        if (direction === 'up') {
            let prevIndex = index - 1;
            while (prevIndex >= 0 && !isVisible(newLayout[prevIndex])) prevIndex--;
            if (prevIndex >= 0) {
                [newLayout[index], newLayout[prevIndex]] = [newLayout[prevIndex], newLayout[index]];
            }
        } else if (direction === 'down') {
            let nextIndex = index + 1;
            while (nextIndex < newLayout.length && !isVisible(newLayout[nextIndex])) nextIndex++;
            if (nextIndex < newLayout.length) {
                [newLayout[index], newLayout[nextIndex]] = [newLayout[nextIndex], newLayout[index]];
            }
        }
        setLayout(newLayout);
    };

    const canMoveUp = (index: number) => {
        let prevIndex = index - 1;
        while (prevIndex >= 0 && !isVisible(layout[prevIndex])) prevIndex--;
        return prevIndex >= 0;
    };

    const canMoveDown = (index: number) => {
        let nextIndex = index + 1;
        while (nextIndex < layout.length && !isVisible(layout[nextIndex])) nextIndex++;
        return nextIndex < layout.length;
    };

    const toggleSection = (index: number) => {
        const newLayout = [...layout];
        newLayout[index].enabled = !newLayout[index].enabled;
        setLayout(newLayout);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateHomeLayout(layout);
        } catch (e) {
            alert("Failed to save layout");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Home Page Layout</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Reorder sections and toggle their visibility on the public home page.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="showOtherPages"
                            checked={showOtherPages}
                            onChange={(e) => setShowOtherPages(e.target.checked)}
                            className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="showOtherPages" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            List sections from other pages
                        </label>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg hover:opacity-80 transition-opacity font-semibold disabled:opacity-50"
                >
                    <Save size={18} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {layout.map((section, index) => {
                        if (!isVisible(section)) return null;
                        
                        return (
                        <li
                            key={section.id}
                            className={`p-4 flex items-center justify-between transition-colors ${section.enabled ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50 opacity-75'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-sm font-mono text-gray-500 w-8 text-center">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg dark:text-gray-200">{section.label}</h3>
                                        {section.type === 'custom_section' && (
                                            <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-primary px-2 py-0.5 rounded-full font-medium">
                                                Custom
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {section.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleSection(index)}
                                    className={`p-2 rounded-lg transition-colors ${section.enabled
                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    title={section.enabled ? "Hide Section" : "Show Section"}
                                >
                                    {section.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>

                                <button
                                    onClick={() => setEditingSection(section)}
                                    className="p-2 text-primary-hover hover:bg-primary/5 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                    title="Edit Section Content"
                                >
                                    <Settings size={20} />
                                </button>

                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                                <button
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={!canMoveUp(index)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Move Up"
                                >
                                    <ArrowUp size={20} />
                                </button>
                                <button
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={!canMoveDown(index)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Move Down"
                                >
                                    <ArrowDown size={20} />
                                </button>
                            </div>
                        </li>
                    )})}
                </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Note</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                    The <strong>Hero Section</strong> and <strong>Footer</strong> are typically fixed in position or handled separately in the design properties, but this list controls the order of major content blocks. Click the <strong>Settings</strong> icon on any section to edit its content.
                </p>
            </div>

            {editingSection && (
                <SectionEditModal
                    sectionId={editingSection.id}
                    sectionLabel={editingSection.label}
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    allSettings={allSettings}
                />
            )}
        </div>
    );
}
