'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateHomeLayout(newLayout: any[]) {
    const supabase = await createClient();

    // We store it as a JSON array in site_settings
    const { error } = await supabase
        .from("site_settings")
        .upsert({
            key: "home_layout",
            value: newLayout,
            label: "Home Page Layout Order",
            type: "json"
        });

    if (error) {
        console.error("Error updating home layout:", error);
        throw new Error("Failed to update home layout");
    }

    revalidatePath("/admin/layout-editor");
    revalidatePath("/"); // Revalidate home page to reflect changes immediately
}
