"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { updatePageLayout } from "@/app/admin/pages/actions";
import { useRouter } from "next/navigation";
import { CustomSection } from "@/app/admin/sections/actions";
import SectionsManager from "./SectionsManager";

type LayoutItem = {
    id: number;
    enabled: boolean;
};

interface Props {
    page: any;
    globalSections: { id: number; title: string }[];
    pageSections: CustomSection[];
    otherSections?: CustomSection[];
}

export default function PageLayoutEditor({ page, globalSections, pageSections, otherSections = [] }: Props) {
    const [layout, setLayout] = useState<LayoutItem[]>(page.layout || []);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedGlobalSection, setSelectedGlobalSection] = useState<string>("");
    const [showOtherPages, setShowOtherPages] = useState(false);
    
    // Simple drag and drop state could be added later, using up/down arrows for now
    const router = useRouter();

    // Map all available sections by ID for quick lookup
    const allSectionsMap = new Map<number, { title: string; type: 'global' | 'page' }>();
    globalSections.forEach(s => allSectionsMap.set(s.id, { title: s.title, type: 'global' }));
    pageSections.forEach(s => allSectionsMap.set(s.id, { title: s.title, type: 'page' }));
    otherSections.forEach(s => allSectionsMap.set(s.id, { title: s.title, type: 'page' }));

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newLayout = [...layout];
        const temp = newLayout[index];
        newLayout[index] = newLayout[index - 1];
        newLayout[index - 1] = temp;
        setLayout(newLayout);
    };

    const handleMoveDown = (index: number) => {
        if (index === layout.length - 1) return;
        const newLayout = [...layout];
        const temp = newLayout[index];
        newLayout[index] = newLayout[index + 1];
        newLayout[index + 1] = temp;
        setLayout(newLayout);
    };

    const handleToggleEnable = (index: number) => {
        const newLayout = [...layout];
        newLayout[index].enabled = !newLayout[index].enabled;
        setLayout(newLayout);
    };

    const handleRemove = (index: number) => {
        const newLayout = [...layout];
        newLayout.splice(index, 1);
        setLayout(newLayout);
    };

    const handleAddGlobal = () => {
        if (!selectedGlobalSection) return;
        const id = parseInt(selectedGlobalSection);
        if (layout.find(l => l.id === id)) {
            alert("This section is already in the layout!");
            return;
        }
        setLayout([...layout, { id, enabled: true }]);
        setSelectedGlobalSection("");
    };

    const handleAddAllPageSections = () => {
        const currentIds = new Set(layout.map(l => l.id));
        const newItems = pageSections
            .filter(s => !currentIds.has(s.id))
            .map(s => ({ id: s.id, enabled: true }));
        
        if (newItems.length > 0) {
            setLayout([...layout, ...newItems]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updatePageLayout(page.id, page.slug, layout);
        setIsSaving(false);
        if (result.success) {
            router.refresh();
            alert("Layout saved successfully!");
        } else {
            alert(result.message);
        }
    };

    // Calculate which page sections are NOT in the layout yet
    const unusedPageSections = pageSections.filter(s => !layout.find(l => l.id === s.id));

    return (
        <div className="space-y-12">
            {/* The Layout Builder */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Layout</h2>
                        <p className="text-gray-500 text-sm mt-1">Arrange the sections as they should appear on the page.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Layout
                    </button>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-zinc-950/50 min-h-[300px]">
                    {layout.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                            Layout is empty. Add sections below.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {layout.map((item, index) => {
                                const sectionInfo = allSectionsMap.get(item.id);
                                const isMissing = !sectionInfo;

                                return (
                                    <div 
                                        key={item.id} 
                                        className={`flex items-center gap-4 bg-white dark:bg-zinc-900 border ${item.enabled ? 'border-gray-200 dark:border-zinc-800' : 'border-gray-100 dark:border-zinc-800/50 opacity-60'} p-4 rounded-xl shadow-sm transition-all`}
                                    >
                                        <div className="flex flex-col gap-1 text-gray-300 dark:text-gray-600">
                                            <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="hover:text-primary disabled:opacity-30"><ArrowUp size={16} /></button>
                                            <button onClick={() => handleMoveDown(index)} disabled={index === layout.length - 1} className="hover:text-primary disabled:opacity-30"><ArrowDown size={16} /></button>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-semibold ${item.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                    {isMissing ? `Unknown Section (ID: ${item.id})` : sectionInfo.title}
                                                </h3>
                                                {!isMissing && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sectionInfo.type === 'global' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                                        {sectionInfo.type === 'global' ? 'Global' : 'Page Specific'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleToggleEnable(index)}
                                                className={`text-sm font-medium ${item.enabled ? 'text-primary-hover dark:text-primary' : 'text-gray-400'}`}
                                            >
                                                {item.enabled ? 'Enabled' : 'Disabled'}
                                            </button>
                                            <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800"></div>
                                            <button onClick={() => handleRemove(index)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remove from Layout">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Add to Layout</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showOtherPagesToggle"
                                checked={showOtherPages}
                                onChange={(e) => setShowOtherPages(e.target.checked)}
                                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <label htmlFor="showOtherPagesToggle" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                Also enlist sections from other pages
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <select 
                                value={selectedGlobalSection}
                                onChange={(e) => setSelectedGlobalSection(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 outline-none text-sm dark:text-white"
                            >
                                <option value="">Select a Section...</option>
                                <optgroup label="Global Sections">
                                    {globalSections.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </optgroup>
                                {showOtherPages && (
                                    <optgroup label="Other Page Sections">
                                        {otherSections.map(s => (
                                            <option key={s.id} value={s.id}>{s.title}</option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                            <button 
                                onClick={handleAddGlobal}
                                disabled={!selectedGlobalSection}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Add Global
                            </button>
                        </div>
                        
                        {unusedPageSections.length > 0 && (
                            <button 
                                onClick={handleAddAllPageSections}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} />
                                Add Unused Page Sections ({unusedPageSections.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Page-Specific Sections Manager */}
            <div className="border border-purple-200 dark:border-purple-900/30 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-purple-50 dark:bg-purple-900/10 p-6 border-b border-purple-100 dark:border-purple-900/20">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 px-2 py-1 rounded text-xs">Page Specific</span>
                        Sections content manager
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Create and manage content for sections that belong specifically to this page.</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-950">
                    <SectionsManager 
                        initialSections={pageSections} 
                        pageId={page.id} 
                        hideLayoutNotice={true} 
                    />
                </div>
            </div>
        </div>
    );
}
