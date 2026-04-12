import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Settings, Trash2, Upload } from "lucide-react";
import { updateItem, deleteItemImage } from "../actions";
import { redirect } from "next/navigation";
import EditItemForm from "./EditItemForm";

export default async function EditItemPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Item and Site Name
    const [
        { data: item },
        { data: settings }
    ] = await Promise.all([
        supabase.from("items")
                .select(`*, item_images (id, image_url)`)
                .eq("id", id)
                .single(),
        supabase.from("site_settings").select("value").eq("key", "site_name").single()
    ]);

    if (!item) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Edit Item</h1>
                <Link href="/admin/items" className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                    Cancel
                </Link>
            </div>

            <EditItemForm 
                item={item} 
                siteName={settings?.value || "PluginTekCMS"} 
            />
        </div>
    );
}
