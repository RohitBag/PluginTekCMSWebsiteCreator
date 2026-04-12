import { createClient } from "@/utils/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const supabase = await createClient();
    const [{ data: settings }, { data: customSections }, { data: services }] = await Promise.all([
        supabase.from('site_settings').select('*'),
        supabase.from('custom_sections').select('id, title, display_order').order('display_order', { ascending: true }),
        supabase.from('services').select('id, title, page_url').order('title', { ascending: true })
    ]);
    
    return <HeaderClient initialSettings={settings || []} initialCustomSections={customSections || []} initialServices={services || []} />
}
