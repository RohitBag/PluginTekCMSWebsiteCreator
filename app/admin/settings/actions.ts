"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type SiteSetting = {
    key: string;
    value: any;
    label: string;
    type: string;
};

export async function updateSiteSettings(settings: SiteSetting[]) {
    const supabase = await createClient();

    try {
        // We perform upserts for each setting
        // Since we are updating multiple rows, and they are independent, we can map them.
        // For atomic consistency, ideally we'd use a stored procedure or just Promise.all since it's not transactional critical.

        const updates = settings.map(setting =>
            supabase
                .from('site_settings')
                .upsert({ 
                    key: setting.key, 
                    value: setting.value,
                    label: setting.label,
                    type: setting.type
                }, { onConflict: 'key' })
        );

        await Promise.all(updates);

        revalidatePath('/', 'layout'); // Revalidate the whole site as settings are global
        revalidatePath('/admin/settings');

        return { success: true, message: "Settings updated successfully" };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, message: "Failed to update settings" };
    }
}

export async function uploadBrandingImage(formData: FormData) {
    const supabase = await createClient();
    const imageFile = formData.get('imageFile') as File;
    const key = formData.get('key') as string; // 'site_logo_url' or 'site_logo_inverted_url'

    if (!imageFile || imageFile.size === 0) {
        return { success: false, message: "No image file provided" };
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${key}-${Date.now()}.${fileExt}`;
    const filePath = `branding/${fileName}`;

    try {
        console.log(`Uploading branding image for key: ${key}, file: ${imageFile.name}`);
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error("Storage Upload Error:", uploadError);
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        console.log(`Generated public URL: ${publicUrl}`);

        // Using upsert instead of update to be safer in case the key doesn't exist
        const { error: dbError } = await supabase
            .from('site_settings')
            .upsert({ 
                key: key, 
                value: publicUrl 
            }, { onConflict: 'key' });

        if (dbError) {
            console.error("Database Update Error:", dbError);
            throw dbError;
        }

        revalidatePath('/', 'layout');
        revalidatePath('/admin/settings');

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Logo Upload Process Failed:", error);
        return { success: false, message: `Failed to upload logo: ${(error as any).message || 'Unknown error'}` };
    }
}
