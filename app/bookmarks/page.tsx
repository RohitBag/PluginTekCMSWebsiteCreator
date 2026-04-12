import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import BookmarkButton from "@/components/items/BookmarkButton";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
    const supabase = await createClient();

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // Fetch Bookmarks with Items and Images
    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select(`
            id,
            items (
                *,
                item_images (image_url)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Flatten data structure
    const bookmarkedItems = bookmarks?.map((b: any) => {
        if (!b.items) return null;
        return {
            ...b.items,
            bookmarkId: b.id
        };
    }).filter(Boolean) || [];

    return (
        <main className="min-h-screen bg-white dark:bg-black flex flex-col">
            <Header />
            <div className="flex-grow container mx-auto px-4" style={{ paddingTop: '200px', paddingBottom: '160px' }}>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Bookmarks</h1>
                <p className="text-gray-500 mb-12">Items you have saved for later.</p>

                {bookmarkedItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <p className="text-gray-400 mb-4">You haven't bookmarked any items yet.</p>
                        <Link href="/#items" className="text-primary hover:text-primary-hover font-medium">
                            Browse Featured Items
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookmarkedItems.map((item: any) => (
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
                                            initialIsBookmarked={true}
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
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4 text-sm">
                                            <MapPin size={16} />
                                            {item.location}
                                        </div>
                                    )}

                                    <div className="flex items-end justify-between">
                                        <div className="text-lg font-bold text-primary-hover dark:text-primary">
                                            {item.price ? new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                maximumFractionDigits: 0
                                            }).format(item.price) : 'Price on Request'}
                                        </div>
                                        <Link
                                            href={`/items/${item.id}`}
                                            className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-primary dark:hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
