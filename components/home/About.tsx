import { createClient } from "@/utils/supabase/static";

export default async function About() {
    const supabase = createClient();
    const { data: settings } = await supabase.from('site_settings').select('*');

    const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

    const aboutTitle = getSetting('about_title') || "About Us";
    const aboutDesc = getSetting('about_desc') || "";
    const aboutSublabel = getSetting('about_sublabel') || "Who We Are";
    const siteName = getSetting('site_name') || "Our Brand";
    const profileTitle = getSetting('profile_title') || "Our Profile";
    const profileDesc = getSetting('profile_desc') || "";
    const imageUrl = getSetting('about_image_url');

    return (
        <section id="about" className="section-spacing bg-white dark:bg-black overflow-hidden relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                    {/* Left Column: Text */}
                    <div className="flex-1 min-w-[300px]">
                        <div className="text-left mb-8">
                            <span className="text-primary uppercase tracking-widest font-semibold block mb-2">{aboutSublabel}</span>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{aboutTitle}</h2>
                        </div>

                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                            {aboutDesc}
                        </p>

                        <h3 className="text-2xl font-semibold text-primary mb-4">{profileTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
                            {profileDesc}
                        </p>
                    </div>

                    {/* Right Column: Image */}
                    <div className="flex-1 min-w-[300px]">
                        <img
                            src={imageUrl}
                            alt={`About ${siteName}`}
                            className="w-full h-full object-cover rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
