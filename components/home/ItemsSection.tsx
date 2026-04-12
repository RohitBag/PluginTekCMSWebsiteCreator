import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import BookmarkButton from "@/components/items/BookmarkButton";

export default async function ItemsSection() {
    const supabase = await createClient();

    // Fetch Items
    const { data: items } = await supabase
        .from("items")
        .select(`
            *,
            item_images (image_url)
        `)
        .eq("is_enabled", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

    // Fetch Settings
    const { data: settingsData } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["items_section_heading", "items_section_subheading"]);

    const settingsMap = settingsData?.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {}) || {};

    const cleanValue = (val: any) => val ? (typeof val === 'string' ? val : JSON.stringify(val).replace(/"/g, '')) : "";

    const heading = cleanValue(settingsMap.items_section_heading) || "Featured Listings";
    const subheading = cleanValue(settingsMap.items_section_subheading) || "Explore our latest offerings and exclusive deals.";

    // User bookmarks are now handled by the BookmarkButton client component
    const userBookmarks: number[] = [];

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section id="featured" className="section-spacing bg-gray-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
                        {heading}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {subheading}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                {item.item_images?.[0]?.image_url ? (
                                    <img
                                        src={item.item_images[0].image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                {/* Bookmark Button Overlay */}
                                <div className="absolute top-4 right-4 z-10">
                                    <BookmarkButton
                                        itemId={item.id}
                                        initialIsBookmarked={userBookmarks.includes(item.id)}
                                        className="bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-sm hover:scale-110"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                                        {item.title}
                                    </h3>
                                </div>

                                {item.location && (
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                        <MapPin size={14} />
                                        {item.location}
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6 h-10">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    <div className="font-bold text-lg text-primary-hover dark:text-primary">
                                        {item.price ? new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                            maximumFractionDigits: 0
                                        }).format(item.price) : 'Price on Request'}
                                    </div>
                                    <Link
                                        href={`/items/${item.id}`}
                                        className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-hover dark:group-hover:text-primary transition-colors"
                                    >
                                        Details <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
