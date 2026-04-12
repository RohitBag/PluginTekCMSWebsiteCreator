"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Testimonial = {
    id: number;
    name: string;
    role?: string;
    content: string;
    image_url?: string;
    rating: number;
    display_order: number;
    is_enabled: boolean;
    created_at?: string;
};

export async function addTestimonial(data: Omit<Testimonial, 'id' | 'created_at'>) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('testimonials').insert(data);
        if (error) throw error;
        revalidatePath('/admin/testimonials');
        revalidatePath('/'); // Home page testimonials section
        return { success: true, message: "Testimonial added successfully" };
    } catch (error) {
        console.error("Add Testimonial Error:", error);
        return { success: false, message: "Failed to add testimonial" };
    }
}

export async function updateTestimonial(id: number, data: Partial<Testimonial>) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('testimonials').update(data).eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true, message: "Testimonial updated successfully" };
    } catch (error) {
        console.error("Update Testimonial Error:", error);
        return { success: false, message: "Failed to update testimonial" };
    }
}

export async function deleteTestimonial(id: number) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true, message: "Testimonial deleted successfully" };
    } catch (error) {
        console.error("Delete Testimonial Error:", error);
        return { success: false, message: "Failed to delete testimonial" };
    }
}
