import { createClient } from "@/utils/supabase/server";
import PagesManager from "@/components/admin/PagesManager";

export default async function PagesPage() {
    const supabase = await createClient();
    const [
        { data: pages },
        { data: settings }
    ] = await Promise.all([
        supabase.from('pages').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('value').eq('key', 'site_name').single()
    ]);

    return (
        <PagesManager 
            initialPages={pages || []} 
            siteName={settings?.value || "PluginTekCMS"}
        />
    );
}
