"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type CustomSection = {
    id: number;
    title: string;
    content: string;
    image_url: string;
    is_html?: boolean;
    css_content?: string;
    is_mobile_custom?: boolean;
    mobile_content?: string;
    mobile_css_content?: string;
    display_order: number;
    page_id?: number | null;
    created_at?: string;
};

export type SectionImage = {
    id: number;
    section_id: number;
    image_url: string;
    storage_path: string;
    created_at: string;
};

export async function upsertSection(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const css_content = formData.get('css_content') as string || '';
    const is_html = formData.get('is_html') === 'true';
    const is_mobile_custom = formData.get('is_mobile_custom') === 'true';
    const mobile_content = formData.get('mobile_content') as string || '';
    const mobile_css_content = formData.get('mobile_css_content') as string || '';
    const page_id_str = formData.get('page_id') as string | null;
    const page_id = page_id_str ? parseInt(page_id_str) : null;
    const imageFile = formData.get('imageFile') as File | null;
    let imageUrl = formData.get('existingImage') as string;

    const removeImage = formData.get('remove_image') === 'true';

    // Handle Image Upload
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `section-${Date.now()}.${fileExt}`;
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
    } else if (removeImage) {
        imageUrl = '';
    }

    const sectionData: Partial<CustomSection> = {
        title,
        content,
        is_html,
        css_content,
        is_mobile_custom,
        mobile_content,
        mobile_css_content,
        page_id,
        image_url: is_html ? '' : imageUrl, // Clear image if it's an HTML section
    };

    try {
        let error;
        if (id) {
            const { error: updateError } = await supabase
                .from('custom_sections')
                .update(sectionData)
                .eq('id', parseInt(id));
            error = updateError;
        } else {
            const { data: maxOrderData } = await supabase.from('custom_sections').select('display_order')
                .is('page_id', page_id === undefined ? null : page_id)
                .order('display_order', { ascending: false }).limit(1).single();
            const nextOrder = (maxOrderData?.display_order || 0) + 1;

            sectionData.display_order = nextOrder;

            const { error: insertError } = await supabase
                .from('custom_sections')
                .insert(sectionData);
            error = insertError;
        }

        if (error) throw error;
        revalidatePath('/admin/sections');
        revalidatePath('/');
        return { success: true, message: id ? "Section updated" : "Section added" };

    } catch (error) {
        console.error("Section Save Error:", error);
        return { success: false, message: `Failed to save section: ${(error as Error).message}` };
    }
}

export async function deleteSection(id: number) {
    const supabase = await createClient();
    try {
        // Get all images associated with this section to delete from storage
        const { data: images } = await supabase.from('section_images').select('storage_path').eq('section_id', id);
        
        if (images && images.length > 0) {
            const paths = images.map(img => img.storage_path);
            await supabase.storage.from('images').remove(paths);
        }

        const { error } = await supabase.from('custom_sections').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/sections');
        revalidatePath('/');
        return { success: true, message: "Section deleted successfully" };
    } catch (error) {
        console.error("Delete Section Error:", error);
        return { success: false, message: "Failed to delete section" };
    }
}

export async function getSectionImages(sectionId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('section_images')
        .select('*')
        .eq('section_id', sectionId)
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error("Error fetching section images:", error);
        return [];
    }
    return data as SectionImage[];
}

export async function uploadSectionImage(formData: FormData) {
    const supabase = await createClient();
    const sectionId = parseInt(formData.get('sectionId') as string);
    const imageFile = formData.get('imageFile') as File;

    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: "No image file provided" };
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `section-${sectionId}-${Date.now()}.${fileExt}`;
    const filePath = `custom-sections/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { success: false, message: "Failed to upload image." };
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

    const { error: insertError } = await supabase
        .from('section_images')
        .insert({
            section_id: sectionId,
            image_url: publicUrl,
            storage_path: filePath
        });

    if (insertError) {
        console.error("Insert Image Error:", insertError);
        // Clean up uploaded file if DB insert fails
        await supabase.storage.from('images').remove([filePath]);
        return { success: false, message: "Failed to save image record." };
    }

    revalidatePath('/admin/sections');
    return { success: true, message: "Image uploaded successfully" };
}

export async function deleteSectionImage(imageId: number, storagePath: string) {
    const supabase = await createClient();
    try {
        // Delete from storage
        const { error: storageError } = await supabase.storage.from('images').remove([storagePath]);
        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabase.from('section_images').delete().eq('id', imageId);
        if (dbError) throw dbError;

        revalidatePath('/admin/sections');
        return { success: true, message: "Image deleted successfully" };
    } catch (error) {
        console.error("Delete Section Image Error:", error);
        return { success: false, message: "Failed to delete image" };
    }
}

export async function reorderSections(items: { id: number; display_order: number }[]) {
    const supabase = await createClient();
    try {
        const updates = items.map(item =>
            supabase.from('custom_sections').update({ display_order: item.display_order }).eq('id', item.id)
        );
        await Promise.all(updates);

        revalidatePath('/admin/sections');
        revalidatePath('/');
        return { success: true, message: "Order updated" };
    } catch (error) {
        console.error("Reorder Error:", error);
        return { success: false, message: "Failed to reorder sections" };
    }
}
