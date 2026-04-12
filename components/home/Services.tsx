import { createClient } from "@/utils/supabase/static";
import Link from "next/link";

export default async function Services() {
    const supabase = createClient();
    
    const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value');
    
    const getSetting = (key: string) => settingsData?.find(s => s.key === key)?.value;

    const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

    return (
        <section id="services" className="section-spacing bg-gray-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-primary uppercase tracking-widest font-semibold block mb-2">{getSetting('services_sublabel') || "What We Do"}</span>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{getSetting('services_header') || "Our Premium Services"}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services?.map((service) => {
                        const cardContent = (
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-transparent hover:border-primary group transform hover:-translate-y-2 h-full cursor-pointer">
                                <div className="text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <i className={service.icon}></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        );

                        return service.page_url ? (
                            <Link key={service.id} href={service.page_url} className="block">
                                {cardContent}
                            </Link>
                        ) : (
                            <div key={service.id} className="block">
                                {cardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
