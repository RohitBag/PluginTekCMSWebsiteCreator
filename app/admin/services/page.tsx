import { createClient } from "@/utils/supabase/server";
import ServicesManager from "@/components/admin/ServicesManager";

export default async function ServicesPage() {
    const supabase = await createClient();
    const { data: services } = await supabase.from('services').select('*').order('display_order', { ascending: true });

    return (
        <ServicesManager initialServices={services || []} />
    );
}
