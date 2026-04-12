import { createClient } from "@/utils/supabase/static";
import { getEmbedInfo } from "@/utils/embed";
import { marked } from "marked";

interface Props {
    sectionId?: number; // If provided, render only that one section
}

export default async function CustomSections({ sectionId }: Props) {
    const supabase = createClient();

    let query = supabase.from('custom_sections').select('*');
    if (sectionId !== undefined) {
        query = query.eq('id', sectionId);
    } else {
        query = query.is('page_id', null).order('display_order', { ascending: true });
    }

    const { data: sections } = await query;

    if (!sections || sections.length === 0) return null;

    // Fetch images for all sections in one query
    const sectionIds = sections.map((s) => s.id);
    const { data: allImages } = await supabase
        .from('section_images')
        .select('*')
        .in('section_id', sectionIds);

    const getProcessedContent = (content: string, sectionId: number) => {
        if (!content) return "";
        let processed = content;
        const images = allImages?.filter(img => img.section_id === sectionId) || [];
        images.forEach(img => {
            const placeholder = `[[img-${img.id}]]`;
            processed = processed.split(placeholder).join(img.image_url);
        });
        return processed;
    };

    return (
        <>
            {sections.map((section, index: number) => {
                const embedInfo = getEmbedInfo(section.content || "");

                if (section.is_html) {
                    const desktopContent = getProcessedContent(section.content || "", section.id);
                    const mobileContent = section.is_mobile_custom 
                        ? getProcessedContent(section.mobile_content || "", section.id)
                        : desktopContent;
                    
                    const desktopCss = section.css_content || "";
                    const mobileCss = section.is_mobile_custom 
                        ? (section.mobile_css_content || "")
                        : desktopCss;

                    return (
                        <section key={section.id} id={`section-${section.id}`} className="w-full relative">
                            <style dangerouslySetInnerHTML={{ __html: `
                                /* Mobile/desktop visibility helpers */
                                #section-${section.id} .desktop-only { display: block; }
                                #section-${section.id} .mobile-only { display: none; }
                                @media (max-width: 768px) {
                                    #section-${section.id} .desktop-only { display: none; }
                                    #section-${section.id} .mobile-only { display: block; }
                                }

                                /* Inject user CSS directly - no wrapping selector */
                                ${desktopCss || ""}

                                /* Mobile override if using separate mobile layout */
                                ${section.is_mobile_custom && mobileCss ? `@media (max-width: 768px) { ${mobileCss} }` : ""}

                                /* Section switcher classes for mobile custom layout */
                                ${section.is_mobile_custom ? `
                                    #section-${section.id} .section-desktop { display: block; }
                                    #section-${section.id} .section-mobile { display: none; }
                                    @media (max-width: 768px) {
                                        #section-${section.id} .section-desktop { display: none; }
                                        #section-${section.id} .section-mobile { display: block; }
                                    }
                                ` : ""}
                            ` }} />
                            
                            {section.is_mobile_custom ? (
                                <>
                                    <div className="section-desktop" dangerouslySetInnerHTML={{ __html: desktopContent }} />
                                    <div className="section-mobile" dangerouslySetInnerHTML={{ __html: mobileContent }} />
                                </>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: desktopContent }} />
                            )}
                        </section>
                    );
                }

                return (
                    <section
                        key={section.id}
                        id={`section-${section.id}`}
                        className={`section-spacing ${index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-black'}`}
                    >
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col-reverse lg:flex-row gap-12 items-start">
                                <div className="flex-[2] min-w-[300px]">
                                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">{section.title}</h2>
                                    {embedInfo ? (
                                        <div className={`w-full overflow-hidden rounded-xl shadow-lg ${embedInfo.type === 'youtube' || embedInfo.type === 'instagram' ? 'bg-black' : 'bg-transparent'} ${embedInfo.type === 'instagram' ? 'max-w-md mx-auto aspect-[9/16] h-[600px]' : 'aspect-video'}`}>
                                            <iframe
                                                src={embedInfo.url}
                                                title={section.title}
                                                className="w-full h-full border-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                allowTransparency={true}
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <div 
                                            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:text-primary hover:prose-a:text-primary-hover prose-ul:text-gray-600 dark:prose-ul:text-gray-400 prose-ol:text-gray-600 dark:prose-ol:text-gray-400 prose-li:text-gray-600 dark:prose-li:text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: marked.parse(section.content || "", { async: false }) as string }}
                                        />
                                    )}
                                </div>

                                {section.image_url && (
                                    <div className="flex-1 min-w-[300px] w-full lg:sticky lg:top-32">
                                        <img
                                            src={section.image_url}
                                            alt={section.title}
                                            className="w-full max-h-[600px] object-cover rounded-xl shadow-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
