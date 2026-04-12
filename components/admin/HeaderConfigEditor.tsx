"use client";

import { Monitor, Smartphone, Layout, ArrowUp, ArrowDown } from "lucide-react";
import { InputGroup } from "./SettingField";

interface HeaderConfig {
    order?: string[];
    items: Record<string, { desktop: string; mobile: string }>;
    desktop: { fontSize: string; alignment: string; fontFamily: string; };
    mobile: { fontSize: string; alignment: string; fontFamily: string; };
    moreLabel: string;
}

const statusOptions = [
    { label: 'Show', value: 'show' },
    { label: 'Move to More', value: 'more' },
    { label: 'Hide', value: 'hide' }
];

const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' }
];

const fontOptions = [
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
];

export default function HeaderConfigEditor({ config, homeLayout, onChange }: { config: HeaderConfig; homeLayout: any[]; onChange: (newConfig: HeaderConfig) => void }) {
    const allItemIds = Array.from(new Set([
        ...homeLayout.filter(s => s.enabled).map(s => s.id),
        'login', 'wishlist', 'profile'
    ]));

    const sortedItemIds = [...allItemIds].sort((a, b) => {
        const order = config.order || [];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB === -1) return 0;
        return (indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB);
    });

    const updateItem = (id: string, platform: 'desktop' | 'mobile', value: string) => {
        const newConfig = { ...config, items: { ...config.items } };
        if (!newConfig.items[id]) newConfig.items[id] = { desktop: 'show', mobile: 'show' };
        newConfig.items[id][platform] = value;
        onChange(newConfig);
    };

    const moveItem = (id: string, direction: 'up' | 'down') => {
        const newOrder = [...sortedItemIds];
        const index = newOrder.indexOf(id);
        if (direction === 'up' && index > 0) [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        else if (direction === 'down' && index < newOrder.length - 1) [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        onChange({ ...config, order: newOrder });
    };

    const updateTypography = (platform: 'desktop' | 'mobile', field: string, value: string) => {
        const newConfig = { ...config, [platform]: { ...config[platform], [field]: value } };
        onChange(newConfig);
    };

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                {[{ key: 'desktop', label: 'Desktop', icon: Monitor, color: 'text-primary' }, { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-secondary' }].map((plat) => (
                    <div key={plat.key} className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-semibold">
                            <plat.icon size={18} className={plat.color} />
                            <span>{plat.label} Typography</span>
                        </div>
                        <div className="space-y-4">
                            <InputGroup label="Font Family" type="select" value={(config[plat.key as 'desktop' | 'mobile'] as any).fontFamily || 'Outfit'} options={fontOptions} onChange={(v) => updateTypography(plat.key as any, 'fontFamily', v)} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Font Size (px)" value={(config[plat.key as 'desktop' | 'mobile'] as any).fontSize || (plat.key === 'desktop' ? '16' : '14')} onChange={(v) => updateTypography(plat.key as any, 'fontSize', v)} />
                                <InputGroup label="Alignment" type="select" value={(config[plat.key as 'desktop' | 'mobile'] as any).alignment || (plat.key === 'desktop' ? 'right' : 'left')} options={alignmentOptions} onChange={(v) => updateTypography(plat.key as any, 'alignment', v)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Layout size={18} className="text-primary" />Menu Items Visibility & Order</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-500 font-medium">
                                <th className="px-6 py-3 w-16 text-center">Order</th>
                                <th className="px-6 py-3">Menu Item</th>
                                <th className="px-6 py-3"><Monitor size={14} className="inline mr-1"/> Desktop</th>
                                <th className="px-6 py-3"><Smartphone size={14} className="inline mr-1"/> Mobile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {sortedItemIds.map((id, index) => (
                                <MenuItemRow key={id} id={id} index={index} totalCount={sortedItemIds.length} config={config} homeLayout={homeLayout} onMove={moveItem} onUpdateVisibility={updateItem} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="max-w-xs">
                <InputGroup label='"More" Menu Label' value={config.moreLabel || 'More'} onChange={(v) => onChange({ ...config, moreLabel: v })} />
            </div>
        </div>
    );
}

function MenuItemRow({ id, index, totalCount, config, homeLayout, onMove, onUpdateVisibility }: any) {
    const itemConfig = config.items[id] || { desktop: 'show', mobile: 'show' };
    const label = id.startsWith('custom_section_') ? 
        homeLayout.find((l: any) => l.id === id)?.label || id : 
        id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
            <td className="px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <button onClick={() => onMove(id, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button onClick={() => onMove(id, 'down')} disabled={index === totalCount - 1} className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded disabled:opacity-30"><ArrowDown size={14} /></button>
                </div>
            </td>
            <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{label}</td>
            {['desktop', 'mobile'].map(plat => (
                <td key={plat} className="px-6 py-4">
                    <select className={`bg-transparent border-none focus:ring-0 cursor-pointer font-medium ${plat === 'desktop' ? 'text-primary' : 'text-secondary'}`} value={itemConfig[plat]} onChange={(e) => onUpdateVisibility(id, plat as any, e.target.value)}>
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </td>
            ))}
        </tr>
    );
}
