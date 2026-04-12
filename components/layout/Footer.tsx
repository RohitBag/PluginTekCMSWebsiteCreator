import { createClient } from "@/utils/supabase/static";
import { getContrastColor } from "@/utils/contrast";

export default async function Footer() {
    const supabase = createClient();
    const { data: settings } = await supabase.from('site_settings').select('*');
    const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

    const footerTagline = getSetting('footer_tagline') || "Professional excellence in every project";
    const socialLinks = getSetting('social_links') || [];
    const siteName = getSetting('site_name') || "PluginTekCMS";
    const complianceInfo = getSetting('compliance_info') || [];
    const copyrightText = getSetting('copyright_text') || `${siteName}. All rights reserved.`;

    const footerBg = getSetting('footer_bg_color') || '#18181b';
    const footerText = getContrastColor(footerBg) === 'black' ? 'text-black' : 'text-white';
    const footerTextBright = footerText;
    const footerTextMuted = footerText;
    const footerBorder = getContrastColor(footerBg) === 'black' ? 'border-gray-200' : 'border-white/10';

    return (
        <footer 
            className={`section-spacing ${footerText}`}
            style={{ backgroundColor: footerBg }}
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Logo & Tagline */}
                    <div>
                        <h2 className={`text-2xl font-bold mb-2 ${footerTextBright}`}>{siteName}</h2>
                        <p className={`${footerTextMuted} mb-4`}>{footerTagline}</p>
                        <div className={`text-sm space-y-1 ${footerTextMuted}`}>
                            {complianceInfo.map((info: any, idx: number) => (
                                <p key={idx}>{info.label}: {info.value}</p>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className={`text-lg font-bold mb-6 ${footerTextBright}`}>Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#services" className="hover:text-primary transition-colors">Treatments</a></li>
                            <li><a href="#portfolio" className="hover:text-primary transition-colors">Video Library</a></li>
                            <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Social Connect */}
                    <div>
                        <h4 className={`text-lg font-bold mb-6 ${footerTextBright}`}>Connect</h4>
                        <div className="flex gap-4">
                            {socialLinks.map((link: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all ${getContrastColor(footerBg) === 'black' ? 'bg-black/10' : 'bg-white/10'}`}
                                >
                                    <i className={`fab fa-${link.platform.toLowerCase() === 'facebook' ? 'facebook-f' : link.platform.toLowerCase()}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`border-t pt-8 text-center text-sm ${footerBorder} ${footerTextMuted}`}>
                    <p>&copy; {new Date().getFullYear()} {copyrightText}</p>
                </div>
            </div>
        </footer>
    );
}
