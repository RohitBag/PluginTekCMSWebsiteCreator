import { createClient } from "@/utils/supabase/static";
import PortfolioClient from "./PortfolioClient";

export default async function Portfolio() {
    const supabase = createClient();
    
    const { data: settings } = await supabase
        .from('site_settings')
        .select('key, value');

    const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

    const { data: projects } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .order('created_at', { ascending: false });

    return <PortfolioClient 
        projects={projects || []} 
        header={getSetting('portfolio_header')}
        sublabel={getSetting('portfolio_sublabel')}
    />;
}
