"use server";

import { createClient } from "@/utils/supabase/server";

export async function uploadImage(formData: FormData) {
    const supabase = await createClient();
    const imageFile = formData.get('imageFile') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: "No image file provided" };
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    try {
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

        return { success: true, url: publicUrl, filePath };
    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, message: "Failed to upload image" };
    }
}
