import { createClient } from "@/utils/supabase/server";
import SectionsManager from "@/components/admin/SectionsManager";

export default async function CustomSectionsPage() {
    const supabase = await createClient();
    const { data: sections } = await supabase.from('custom_sections').select('*').is('page_id', null).order('display_order', { ascending: true });

    return (
        <SectionsManager initialSections={sections || []} />
    );
}
