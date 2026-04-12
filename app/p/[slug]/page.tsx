import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomSections from "@/components/home/CustomSections";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    
    // Fetch page SEO and site settings in parallel
    const [
        { data: page },
        { data: settings }
    ] = await Promise.all([
        supabase.from('pages').select('title, seo_title, seo_description').eq('slug', slug).single(),
        supabase.from('site_settings').select('value').eq('key', 'site_name').single()
    ]);

    const siteName = settings?.value || "PluginTekCMS";
    const title = page?.seo_title || (page ? `${page.title} | ${siteName}` : `Page | ${siteName}`);
    const description = page?.seo_description || `Learn more about ${page?.title} at ${siteName}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Supabase Error fetching page:", error);
    }

    if (!page) {
        console.log("Page not found for slug:", slug);
        notFound();
    }

    // Fetch page images for HTML content interpolation
    const { data: pageImages } = await supabase
        .from('page_images')
        .select('*')
        .eq('page_id', page.id);

    let processedContent = page.content;
    if (processedContent && pageImages && pageImages.length > 0) {
        pageImages.forEach(img => {
            const regex = new RegExp(`\\[\\[img-${img.id}\\]\\]`, 'g');
            processedContent = processedContent.replace(regex, img.image_url);
        });
    }

    const hasLayout = page.layout && Array.isArray(page.layout) && page.layout.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black w-full pt-[80px]">
            <Header />
            
            {hasLayout ? (
                <main className="flex-grow w-full">
                    <div className="w-full relative pb-20">
                        {page.layout
                            .filter((item: any) => item.enabled)
                            .map((item: any) => (
                                <CustomSections key={item.id} sectionId={item.id} />
                            ))
                        }
                    </div>
                </main>
            ) : (
                <main className="flex-grow bg-gray-50 dark:bg-zinc-950 pt-16 pb-16">
                    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Hero section for the page */}
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-center leading-tight">
                                {page.title}
                            </h1>
                            
                            {page.image_url && (
                                <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-xl mt-8">
                                    <Image 
                                        src={page.image_url} 
                                        alt={page.title} 
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                                </div>
                            )}
                        </div>

                        {/* Content Section Fallback */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-zinc-800">
                            {processedContent ? (
                                <div 
                                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-hover prose-img:rounded-xl prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{ __html: processedContent }}
                                />
                            ) : (
                                <div className="text-center text-gray-400 py-12">No content added yet.</div>
                            )}
                        </div>
                    </article>
                </main>
            )}
            
            <Footer />
        </div>
    );
}

