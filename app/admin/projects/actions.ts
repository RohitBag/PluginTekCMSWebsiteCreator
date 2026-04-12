"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Project = {
    id: number;
    title: string;
    location: string;
    description: string;
    thumbnail_url: string;
    seo_title?: string;
    seo_description?: string;
    created_at?: string;
    project_images?: ProjectImage[];
};

export type ProjectImage = {
    id: number;
    project_id: number;
    image_url: string;
    display_order: number;
};

export async function upsertProject(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const seo_title = formData.get('seo_title') as string || '';
    const seo_description = formData.get('seo_description') as string || '';
    const imageFile = formData.get('imageFile') as File | null;

    // Handle Image Upload
    let imageUrl = formData.get('existingImage') as string;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            return { success: false, message: "Failed to upload image. Ensure 'images' bucket exists in Supabase Storage." };
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = publicUrl;
    }

    const projectData = {
        title,
        location,
        description,
        thumbnail_url: imageUrl || '/placeholder.jpg',
        seo_title,
        seo_description
    };

    try {
        let error;
        let projectId: number | undefined;

        if (id) {
            const { error: updateError } = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', parseInt(id));
            error = updateError;
            projectId = parseInt(id);
        } else {
            const { data, error: insertError } = await supabase
                .from('projects')
                .insert(projectData)
                .select('id')
                .single();
            error = insertError;
            projectId = data?.id;
        }

        if (error) throw error;
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return { success: true, message: id ? "Project updated" : "Project added", projectId };

    } catch (error) {
        console.error("Project Save Error:", error);
        return { success: false, message: `Failed to save project: ${(error as Error).message}` };
    }
}


export async function deleteProject(id: number) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return { success: true, message: "Project deleted successfully" };
    } catch (error) {
        console.error("Delete Project Error:", error);
        return { success: false, message: "Failed to delete project" };
    }
}

export async function addGalleryImages(projectId: number, imageFiles: File[]) {
    const supabase = await createClient();

    try {
        // Get current max display_order
        const { data: existing } = await supabase
            .from('project_images')
            .select('display_order')
            .eq('project_id', projectId)
            .order('display_order', { ascending: false })
            .limit(1);

        let nextOrder = (existing?.[0]?.display_order || 0) + 1;

        for (const file of imageFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `project-${projectId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                continue; // Skip this file, continue with others
            }

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

            await supabase.from('project_images').insert({
                project_id: projectId,
                image_url: publicUrl,
                display_order: nextOrder++
            });
        }

        revalidatePath('/admin/projects');
        revalidatePath('/');
        return { success: true, message: "Images uploaded successfully" };
    } catch (error) {
        console.error("Gallery Upload Error:", error);
        return { success: false, message: "Failed to upload gallery images" };
    }
}

export async function deleteGalleryImage(imageId: number) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('project_images').delete().eq('id', imageId);
        if (error) throw error;
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return { success: true, message: "Image deleted successfully" };
    } catch (error) {
        console.error("Delete Image Error:", error);
        return { success: false, message: "Failed to delete image" };
    }
}

export async function reorderGalleryImages(updates: { id: number; display_order: number }[]) {
    const supabase = await createClient();
    try {
        const promises = updates.map(item =>
            supabase.from('project_images').update({ display_order: item.display_order }).eq('id', item.id)
        );
        await Promise.all(promises);
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return { success: true, message: "Order updated" };
    } catch (error) {
        console.error("Reorder Error:", error);
        return { success: false, message: "Failed to reorder images" };
    }
}
