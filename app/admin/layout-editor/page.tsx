import { createClient } from "@/utils/supabase/server";
import LayoutEditorPage from "./LayoutEditor";

export const dynamic = 'force-dynamic';

// Static (built-in) sections common to every site
const STATIC_SECTIONS = [
    { id: "hero", type: "fixed", label: "Hero Section", enabled: true },
    { id: "about", type: "component", label: "About Section", enabled: true },
    { id: "items", type: "component", label: "Featured Items", enabled: true },
    { id: "services", type: "component", label: "Services", enabled: true },
    { id: "portfolio", type: "component", label: "Gallery", enabled: true },
    { id: "testimonials", type: "component", label: "Testimonials", enabled: true },
    { id: "contact", type: "component", label: "Contact Section", enabled: true },
];

export default async function Page() {
    const supabase = await createClient();

    // Fetch saved layout, custom sections, and all site settings in parallel
    const [{ data: layoutData }, { data: customSections }, { data: settings }] = await Promise.all([
        supabase.from("site_settings").select("value").eq("key", "home_layout").single(),
        supabase.from("custom_sections").select("id, title, page_id").order("display_order", { ascending: true }),
        supabase.from("site_settings").select("*"),
    ]);

    const savedLayout: any[] = layoutData?.value || [];

    // Build a map of saved layout entries by id for quick lookup
    const savedMap = new Map(savedLayout.map((s: any) => [s.id, s]));

    // Create dynamic entries for each custom section (type: custom_section)
    const customEntries = (customSections || []).map((cs: any) => {
        const savedEntry = savedMap.get(`custom_section_${cs.id}`);
        if (savedEntry) {
            // Merge saved configuration (enabled, etc.) with fresh title from DB
            return { ...savedEntry, label: cs.title, pageId: cs.page_id };
        }
        return {
            id: `custom_section_${cs.id}`,
            type: "custom_section",
            label: cs.title,
            enabled: !cs.page_id,
            pageId: cs.page_id,
        };
    });

    // Build maps for quick validation
    const customMap = new Map(customEntries.map((e: any) => [e.id, e]));
    const staticMap = new Map(STATIC_SECTIONS.map((e: any) => [e.id, e]));

    const finalLayout: any[] = [];
    const usedIds = new Set<string>();

    // 1. Preserve saved layout order for existing sections (both static and custom)
    for (const savedItem of savedLayout) {
        if (savedItem.id === "custom") continue;

        if (savedItem.id.startsWith("custom_section_")) {
            if (customMap.has(savedItem.id)) {
                // Use the fresh entry from customEntries to keep title/pageId updated,
                // but preserve the 'enabled' state from the saved layout
                const fresh = customMap.get(savedItem.id);
                finalLayout.push({ ...fresh, enabled: savedItem.enabled });
                usedIds.add(savedItem.id);
            }
        } else if (staticMap.has(savedItem.id)) {
            // Use fresh entry from staticMap (for updated labels) but preserve saved enabled state
            const fresh = staticMap.get(savedItem.id);
            finalLayout.push({ ...fresh, enabled: savedItem.enabled });
            usedIds.add(savedItem.id);
        }
    }

    // 2. Append missing static sections
    for (const staticItem of STATIC_SECTIONS) {
        if (!usedIds.has(staticItem.id)) {
            finalLayout.push(staticItem);
            usedIds.add(staticItem.id);
        }
    }

    // 3. Append new custom sections to the end
    for (const customItem of customEntries) {
        if (!usedIds.has(customItem.id)) {
            finalLayout.push(customItem);
            usedIds.add(customItem.id);
        }
    }

    return <LayoutEditorPage initialLayout={finalLayout} allSettings={settings || []} />;
}
