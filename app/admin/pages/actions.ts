"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Page = {
    id: number;
    title: string;
    slug: string;
    content: string;
    layout?: any[];
    image_url: string;
    seo_title?: string;
    seo_description?: string;
    created_at?: string;
    updated_at?: string;
};

export async function upsertPage(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string || '';
    const seo_title = formData.get('seo_title') as string || '';
    const seo_description = formData.get('seo_description') as string || '';
    const imageFile = formData.get('imageFile') as File | null;
    let imageUrl = formData.get('existingImage') as string;

    // Handle Image Upload
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `page-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            return { success: false, message: "Failed to upload image. Ensure 'images' bucket exists." };
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = publicUrl;
    }

    const pageData: Partial<Page> = {
        title,
        slug,
        content,
        image_url: imageUrl,
        seo_title,
        seo_description,
        updated_at: new Date().toISOString()
    };

    try {
        let error;
        if (id) {
            const { error: updateError } = await supabase
                .from('pages')
                .update(pageData)
                .eq('id', parseInt(id));
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('pages')
                .insert(pageData);
            error = insertError;
        }

        if (error) throw error;
        revalidatePath('/admin/pages');
        revalidatePath(`/p/${slug}`);
        return { success: true, message: id ? "Page updated" : "Page added" };

    } catch (error) {
        console.error("Page Save Error:", error);
        return { success: false, message: `Failed to save page: ${(error as Error).message}` };
    }
}

export async function deletePage(id: number, slug: string) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('pages').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/pages');
        revalidatePath(`/p/${slug}`);
        return { success: true, message: "Page deleted successfully" };
    } catch (error) {
        console.error("Delete Page Error:", error);
        return { success: false, message: "Failed to delete page" };
    }
}

export async function updatePageLayout(id: number, slug: string, layout: any[]) {
    const supabase = await createClient();
    try {
        const { error } = await supabase
            .from('pages')
            .update({ layout, updated_at: new Date().toISOString() })
            .eq('id', id);
            
        if (error) throw error;
        revalidatePath('/admin/pages');
        revalidatePath(`/p/${slug}`);
        return { success: true, message: "Page layout updated successfully" };
    } catch (error) {
        console.error("Save Page Layout Error:", error);
        return { success: false, message: "Failed to update page layout" };
    }
}

export type PageImage = {
    id: number;
    page_id: number;
    image_url: string;
    storage_path: string;
    created_at: string;
};

export async function getPageImages(pageId: number) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('page_images')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: true });
    return data || [];
}

export async function uploadPageImage(formData: FormData) {
    const supabase = await createClient();
    const pageId = formData.get('pageId') as string;
    const file = formData.get('imageFile') as File;

    if (!file || !pageId) return { success: false, message: "Missing file or page ID" };

    const fileExt = file.name.split('.').pop();
    const fileName = `page-${pageId}-${Date.now()}.${fileExt}`;
    const filePath = `pages/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

    if (uploadError) return { success: false, message: "Upload failed" };

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

    const { error: dbError } = await supabase
        .from('page_images')
        .insert({
            page_id: parseInt(pageId),
            image_url: publicUrl,
            storage_path: filePath
        });

    if (dbError) return { success: false, message: "Database insert failed" };

    revalidatePath('/admin/pages');
    return { success: true, message: "Image uploaded" };
}

export async function deletePageImage(imageId: number, storagePath: string) {
    const supabase = await createClient();

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
        .from('images')
        .remove([storagePath]);

    if (storageError) console.error("Error deleting from storage:", storageError);

    // 2. Delete from database
    const { error: dbError } = await supabase
        .from('page_images')
        .delete()
        .eq('id', imageId);

    if (dbError) return { success: false, message: "Failed to delete from database" };

    revalidatePath('/admin/pages');
    return { success: true, message: "Image deleted" };
}
