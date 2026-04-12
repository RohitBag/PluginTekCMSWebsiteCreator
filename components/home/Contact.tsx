import { createClient } from "@/utils/supabase/static";

export default async function Contact() {
    const supabase = createClient();
    const { data: settings } = await supabase.from('site_settings').select('*');

    const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

    const phones = getSetting('contact_phones') || [];
    const emails = getSetting('contact_emails') || [];
    const address = getSetting('contact_address') || "";
    const mapUrl = getSetting('contact_map_url') || "#";

    return (
        <section id="contact" className="section-spacing bg-white dark:bg-black relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-primary uppercase tracking-widest font-semibold block mb-2">{getSetting('contact_sublabel') || "Contact Us"}</span>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{getSetting('contact_header') || "Get in Touch"}</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mt-12">
                    {/* Phones */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm flex-1 min-w-[300px] text-center border-t-4 border-transparent hover:border-primary transition-colors">
                        <div className="text-3xl text-primary mb-6"><i className="fas fa-phone"></i></div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{getSetting('contact_card_phone_title') || "Call Us"}</h3>
                        <div className="space-y-2">
                            {phones.map((phone: string, idx: number) => (
                                <p key={idx}>
                                    <a href={`tel:${phone.split('(')[0].replace(/\s/g, '')}`} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                        {phone}
                                    </a>
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Emails */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm flex-1 min-w-[300px] text-center border-t-4 border-transparent hover:border-primary transition-colors">
                        <div className="text-3xl text-primary mb-6"><i className="fas fa-envelope"></i></div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{getSetting('contact_card_email_title') || "Email & Booking"}</h3>
                        <div className="space-y-2">
                            {emails.map((email: string, idx: number) => (
                                <p key={idx}>
                                    <a href={`mailto:${email}`} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                        {email}
                                    </a>
                                </p>
                            ))}
                            <p className="text-sm text-gray-500 mt-4">{getSetting('contact_fee_label') || "Service Fee:"} {getSetting('consultation_fee') || '$ 100.00'}</p>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm flex-[1.5] min-w-[300px] text-left border-t-4 border-transparent hover:border-primary transition-colors">
                        <div className="text-3xl text-primary mb-6 text-center"><i className="fas fa-map-marker-alt"></i></div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{getSetting('contact_card_visit_title') || "Visit Us"}</h3>

                        <div className="space-y-6">
                            <div>
                                <strong className="block text-gray-900 dark:text-white mb-1">{getSetting('contact_clinic_label') || "Office Location:"}</strong>
                                <a href={mapUrl} target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm leading-relaxed">
                                    {address}
                                </a>
                                <p className="text-xs text-gray-400 mt-2 italic">{getSetting('contact_clinic_note')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
