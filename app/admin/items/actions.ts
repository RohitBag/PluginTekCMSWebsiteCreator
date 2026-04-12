'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createItem(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    // const type = formData.get("type") as string; // Removed per user request
    const priceRaw = formData.get("price") as string;
    const price = priceRaw ? parseInt(priceRaw, 10) : null;
    const location = formData.get("location") as string;
    const action_label = formData.get("action_label") as string;
    const action_url = formData.get("action_url") as string;
    const seo_title = formData.get("seo_title") as string || '';
    const seo_description = formData.get("seo_description") as string || '';

    // 1. Insert Item
    const { data: item, error } = await supabase
        .from("items")
        .insert({
            title,
            description,
            price,
            location,
            action_label,
            action_url,
            seo_title,
            seo_description
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating item:", error);
        throw new Error("Failed to create item");
    }

    // 2. Handle Images
    const images = formData.getAll("images") as File[];

    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image.size === 0) continue;

            const filename = `item-${item.id}-${Date.now()}-${i}-${image.name}`;

            // Upload to 'images' bucket
            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filename, image);

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                continue;
            }

            const { data: publicUrlData } = supabase.storage
                .from("images")
                .getPublicUrl(filename);

            // Insert into item_images table
            await supabase
                .from("item_images")
                .insert({
                    item_id: item.id,
                    image_url: publicUrlData.publicUrl,
                    display_order: i,
                });
        }
    }

    revalidatePath("/admin/items");
    revalidatePath("/");
    redirect("/admin/items");
}

export async function updateItem(id: number, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceRaw = formData.get("price") as string;
    const price = priceRaw ? parseInt(priceRaw, 10) : null;
    const location = formData.get("location") as string;
    const action_label = formData.get("action_label") as string;
    const action_url = formData.get("action_url") as string;
    const seo_title = formData.get("seo_title") as string || '';
    const seo_description = formData.get("seo_description") as string || '';

    // 1. Update text fields
    const { error } = await supabase
        .from("items")
        .update({
            title,
            description,
            price,
            location,
            action_label,
            action_url,
            seo_title,
            seo_description
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating item:", error);
        throw new Error("Failed to update item");
    }

    // 2. Handle New Images
    const images = formData.getAll("images") as File[];

    // We need to know the current max display_order to append new images correctly
    // But for simplicity, we can just use a large enough number or current timestamp logic if needed by user.
    // Let's quickly get the count or max order.
    const { count } = await supabase.from('item_images').select('*', { count: 'exact', head: true }).eq('item_id', id);
    let startOrder = count || 0;

    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image.size === 0) continue;

            const filename = `item-${id}-${Date.now()}-${i}-${image.name}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filename, image);

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                continue;
            }

            const { data: publicUrlData } = supabase.storage
                .from("images")
                .getPublicUrl(filename);

            await supabase
                .from("item_images")
                .insert({
                    item_id: id,
                    image_url: publicUrlData.publicUrl,
                    display_order: startOrder + i,
                });
        }
    }

    revalidatePath("/admin/items");
    revalidatePath(`/admin/items/${id}`);
    revalidatePath("/");
    redirect("/admin/items");
}

export async function deleteItemImage(imageId: number) {
    const supabase = await createClient();

    // Optional: Delete from storage as well if needed, but for now just DB ref.
    const { error } = await supabase
        .from("item_images")
        .delete()
        .eq("id", imageId);

    if (error) {
        console.error("Error deleting image:", error);
        throw new Error("Failed to delete image");
    }

    revalidatePath("/admin/items"); // To act as a generic refresh if page reload needed
}

export async function deleteItem(id: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting item:", error);
        throw new Error("Failed to delete item");
    }

    revalidatePath("/admin/items");
    revalidatePath("/");
}

export async function toggleItemStatus(id: number, currentStatus: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("items")
        .update({ is_enabled: !currentStatus })
        .eq("id", id);

    if (error) {
        console.error("Error updating item status:", error);
        throw new Error("Failed to update item status");
    }

    revalidatePath("/admin/items");
    revalidatePath("/");
}

export async function updateItemSettings(formData: FormData) {
    const supabase = await createClient();
    const label = formData.get("item_type_label") as string;
    const heading = formData.get("items_section_heading") as string;
    const subheading = formData.get("items_section_subheading") as string;

    // 1. Update Global Label
    const { error: labelError } = await supabase
        .from("site_settings")
        .upsert({
            key: "item_type_label",
            value: label,
            label: "Global Item Type Label",
            type: "text"
        });

    if (labelError) console.error("Error updating label:", labelError);

    // 2. Update Heading
    const { error: headingError } = await supabase
        .from("site_settings")
        .upsert({
            key: "items_section_heading",
            value: heading,
            label: "Items Section Heading",
            type: "text"
        });

    if (headingError) console.error("Error updating heading:", headingError);

    // 3. Update Subheading
    const { error: subheadingError } = await supabase
        .from("site_settings")
        .upsert({
            key: "items_section_subheading",
            value: subheading,
            label: "Items Section Subheading",
            type: "textarea"
        });

    if (subheadingError) console.error("Error updating subheading:", subheadingError);

    if (labelError || headingError || subheadingError) {
        throw new Error("Failed to update settings");
    }

    revalidatePath("/admin/items");
    revalidatePath("/");
}
