import { createClient } from "@/utils/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: settings } = await supabase.from('site_settings').select('*');

    return (
        <SettingsForm initialSettings={settings || []} />
    );
}



