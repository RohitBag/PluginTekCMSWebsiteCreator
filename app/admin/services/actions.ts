"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Service = {
    id: number;
    title: string;
    description: string;
    icon: string;
    page_url?: string;
    display_order: number;
    created_at?: string;
};

export async function addService(data: Omit<Service, 'id' | 'created_at'>) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('services').insert(data);
        if (error) throw error;
        revalidatePath('/admin/services');
        revalidatePath('/'); // Home page services list
        return { success: true, message: "Service added successfully" };
    } catch (error) {
        console.error("Add Service Error:", error);
        return { success: false, message: "Failed to add service" };
    }
}

export async function updateService(id: number, data: Partial<Service>) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('services').update(data).eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/services');
        revalidatePath('/');
        return { success: true, message: "Service updated successfully" };
    } catch (error) {
        console.error("Update Service Error:", error);
        return { success: false, message: "Failed to update service" };
    }
}

export async function deleteService(id: number) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/services');
        revalidatePath('/');
        return { success: true, message: "Service deleted successfully" };
    } catch (error) {
        console.error("Delete Service Error:", error);
        return { success: false, message: "Failed to delete service" };
    }
}
