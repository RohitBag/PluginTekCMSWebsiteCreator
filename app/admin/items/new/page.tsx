import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import NewItemForm from "./NewItemForm";

export default async function NewItemPage() {
    const supabase = await createClient();

    // Fetch Site Name
    const { data: settings } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "site_name")
        .single();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Add New Item</h1>
                <Link href="/admin/items" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                    Cancel
                </Link>
            </div>

            <NewItemForm siteName={settings?.value || "PluginTekCMS"} />
        </div>
    );
}
