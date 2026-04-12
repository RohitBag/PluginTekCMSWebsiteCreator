import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PageLayoutEditor from "@/components/admin/PageLayoutEditor";

export default async function PageLayoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    
    // Fetch the page
    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('id', parseInt(id))
        .single();

    if (!page) {
        notFound();
    }

    // Fetch ALL custom sections (global, this page, and others)
    const { data: allSections } = await supabase
        .from('custom_sections')
        .select('*')
        .order('display_order', { ascending: true });

    const globalSections = allSections?.filter(s => !s.page_id).map(s => ({ id: s.id, title: s.title })) || [];
    const pageSections = allSections?.filter(s => s.page_id === parseInt(id)) || [];
    const otherSections = allSections?.filter(s => s.page_id && s.page_id !== parseInt(id)) || [];

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Layout: {page.title}
                </h1>
                <p className="text-gray-500 mt-2">
                    Manage the custom sections and layout ordering for this specific page.
                </p>
            </div>

            <PageLayoutEditor 
                page={page} 
                globalSections={globalSections} 
                pageSections={pageSections} 
                otherSections={otherSections}
            />
        </div>
    );
}
