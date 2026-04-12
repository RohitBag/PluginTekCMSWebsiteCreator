import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Settings, Pencil } from "lucide-react";
import { deleteItem, toggleItemStatus, updateItemSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
    const supabase = await createClient();

    // Fetch Items
    const { data: items, error } = await supabase
        .from("items")
        .select(`
            *,
            item_images (image_url)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching items:", error);
    }

    // Fetch Global Settings
    const { data: settingsData } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["item_type_label", "items_section_heading", "items_section_subheading"]);

    const settingsMap = settingsData?.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {}) || {};

    const cleanValue = (val: any) => val ? (typeof val === 'string' ? val : JSON.stringify(val).replace(/"/g, '')) : "";

    const itemTypeLabel = cleanValue(settingsMap.item_type_label) || "Item";
    const sectionHeading = cleanValue(settingsMap.items_section_heading) || "Featured Listings";
    const sectionSubheading = cleanValue(settingsMap.items_section_subheading) || "Explore our latest offerings and exclusive deals.";

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold dark:text-white">Items Listing</h1>
                <Link
                    href="/admin/items/new"
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                >
                    <Plus size={20} />
                    Add New {itemTypeLabel}
                </Link>
            </div>

            {/* Global Configuration Section */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
                    <Settings size={18} /> Configuration
                </h2>
                <form action={updateItemSettings} className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Global Item Type Name (e.g. Property)
                        </label>
                        <input
                            name="item_type_label"
                            defaultValue={itemTypeLabel}
                            type="text"
                            placeholder="e.g. Property"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                        <p className="text-xs text-gray-500">
                            Used for button labels (e.g. "Add New <b>Property</b>").
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Section Heading
                        </label>
                        <input
                            name="items_section_heading"
                            defaultValue={sectionHeading}
                            type="text"
                            placeholder="e.g. Featured Listings"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Section Subheading
                        </label>
                        <textarea
                            name="items_section_subheading"
                            defaultValue={sectionSubheading}
                            rows={2}
                            placeholder="e.g. Explore our latest offerings..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    Error loading items: {error.message}. Please ensure the database migration was run.
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Image</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {items?.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        {item.item_images?.[0]?.image_url ? (
                                            <img
                                                src={item.item_images[0].image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium dark:text-gray-200">{item.title}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">
                                    {item.price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price) : '-'}
                                </td>
                                <td className="p-4">
                                    <form action={toggleItemStatus.bind(null, item.id, item.is_enabled)}>
                                        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${item.is_enabled
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                            {item.is_enabled ? (
                                                <><Eye size={12} /> Active</>
                                            ) : (
                                                <><EyeOff size={12} /> Hidden</>
                                            )}
                                        </button>
                                    </form>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/items/${item.id}`}
                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        <form action={deleteItem.bind(null, item.id)}>
                                            <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!items || items.length === 0) && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {error ? "Database error." : `No items found. Click "Add New ${itemTypeLabel}" to create one.`}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
