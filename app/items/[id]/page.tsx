import { createClient } from "@/utils/supabase/static";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, MapPin, Share2, Phone, Mail, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "./ImageGallery";
import BookmarkButton from "@/components/items/BookmarkButton";
import { Metadata } from "next";

export const revalidate = 15;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params;
    const supabase = createClient();
    
    const [
        { data: item },
        { data: settings }
    ] = await Promise.all([
        supabase.from('items').select('title, seo_title, seo_description').eq('id', id).single(),
        supabase.from('site_settings').select('value').eq('key', 'site_name').single()
    ]);

    const siteName = settings?.value || "PluginTekCMS";
    const title = item?.seo_title || (item ? `${item.title} | ${siteName}` : `Item | ${siteName}`);
    const description = item?.seo_description || `View details for ${item?.title} on ${siteName}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

export async function generateStaticParams() {
    const supabase = createClient();
    const { data: items } = await supabase.from("items").select("id");

    return items?.map((item) => ({
        id: item.id.toString(),
    })) || [];
}

export default async function ItemDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = createClient();

    const { data: item } = await supabase
        .from("items")
        .select(`*`)
        .eq("id", id)
        .single();

    if (!item) {
        notFound();
    }

    // Fetch images
    const { data: imagesData } = await supabase
        .from('item_images')
        .select('*')
        .eq('item_id', item.id)
        .order('display_order', { ascending: true });

    const images = imagesData?.map((img: any) => img.image_url) || [];

    // Bookmark state is handled by client component because this page is static
    let isBookmarked = false;

    return (
        <main className="min-h-screen bg-white dark:bg-black flex flex-col">
            <Header />
            <div className="flex-grow pt-[160px] pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <Link
                        href="/#items"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Listings
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Gallery */}
                        <div className="lg:col-span-2 space-y-4 relative">
                            <div className="relative">
                                {/* Pass images to Gallery Component if it handles image strings */}
                                {/* Previously we were mapping manually, ImageGallery expects image list or similar. 
                                    Let's check ImageGallery signature if possible, assuming it takes images prop.
                                    The previous file used <ImageGallery images={images} /> where images was string[]?
                                    Wait, in the diff it looked like it was passing item_images objects?
                                    Actually I see: const images = item.item_images?.map((img: any) => img.image_url) || [];
                                    And <ImageGallery images={images || []} />
                                    So it takes string[].
                                */}
                                <ImageGallery images={images} />

                                <div className="absolute top-4 right-4 z-10">
                                    <BookmarkButton
                                        itemId={item.id}
                                        initialIsBookmarked={isBookmarked}
                                        className="bg-white/90 dark:bg-black/80 p-3 rounded-full shadow-lg hover:scale-110"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h1>
                                {item.location && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <MapPin size={18} />
                                        {item.location}
                                    </div>
                                )}
                            </div>

                            <div className="text-2xl font-bold text-primary-hover dark:text-primary mb-6">
                                {item.price ? new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(item.price) : 'Price on Request'}
                            </div>

                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                <p>{item.description}</p>
                            </div>

                            {/* Action Card */}
                            <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                <h3 className="font-semibold text-lg mb-4 dark:text-white">Interested?</h3>
                                {item.action_url && (
                                    <a
                                        href={item.action_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity mb-4"
                                    >
                                        {item.action_url.startsWith("tel:") ? <Phone size={20} /> :
                                            item.action_url.startsWith("mailto:") ? <Mail size={20} /> :
                                                <ExternalLink size={20} />}
                                        {item.action_label || "Contact Us"}
                                    </a>
                                )}
                                <button className="flex items-center justify-center gap-2 w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white py-3 rounded-xl font-semibold border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                    <Share2 size={18} /> Share this Listing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
