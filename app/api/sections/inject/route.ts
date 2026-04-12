import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("x-api-key");
        const body = await request.json();
        const { title, content, css_content, is_html } = body;

        // 1. Auth Check
        if (!process.env.SECTION_INJECTION_KEY || authHeader !== process.env.SECTION_INJECTION_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Locate Section (Case-insensitive match on title)
        const { data: existing } = await supabase
            .from("custom_sections")
            .select("id")
            .ilike("title", `%${title}%`)
            .maybeSingle();

        let result;
        if (existing) {
            console.log(`Updating existing section: ${existing.id}`);
            result = await supabase
                .from("custom_sections")
                .update({ 
                    content, 
                    css_content, 
                    is_html: is_html ?? true,
                    is_mobile_custom: body.is_mobile_custom ?? false,
                    mobile_content: body.mobile_content ?? "",
                    image_url: "" // Clear image for custom HTML sections
                })
                .eq("id", existing.id);
        } else {
            console.log("Creating new section");
            result = await supabase
                .from("custom_sections")
                .insert({ 
                    title, 
                    content, 
                    css_content, 
                    is_html: is_html ?? true,
                    display_order: 100 
                });
        }

        if (result.error) throw result.error;

        // 3. Revalidate! This is the magic step.
        revalidatePath("/");

        return NextResponse.json({ 
            success: true, 
            message: existing ? "Section updated" : "Section created",
            revalidated: true
        });

    } catch (error: any) {
        console.error("Injection API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
