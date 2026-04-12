import { createClient } from "@/utils/supabase/server";
import ProjectsManager from "@/components/admin/ProjectsManager";

export default async function ProjectsPage() {
    const supabase = await createClient();
    
    const [
        { data: projects },
        { data: settings }
    ] = await Promise.all([
        supabase.from('projects')
                .select('*, project_images(*)')
                .order('created_at', { ascending: false }),
        supabase.from('site_settings').select('value').eq('key', 'site_name').single()
    ]);

    return (
        <ProjectsManager 
            initialProjects={projects || []} 
            siteName={settings?.value || "PluginTekCMS"} 
        />
    );
}
