"use client";

import { InputGroup } from "./SettingField";

export function LogoFiltersSection({ getValue, updateLocalSetting }: { 
    getValue: (key: string) => any; 
    updateLocalSetting: (key: string, value: any) => void; 
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                Logo Filters (Fine-tuning)
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
                {/* Light Mode Filters */}
                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Light Mode Logo
                    </h4>
                    <div className="grid gap-4">
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
                <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                        Dark Mode Logo
                    </h4>
                    <div className="grid gap-4">
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
    );
}
