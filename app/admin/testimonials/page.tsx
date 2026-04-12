import { createClient } from "@/utils/supabase/server";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export default async function TestimonialsPage() {
    const supabase = await createClient();
    const { data: testimonials } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
                <p className="text-gray-500 dark:text-zinc-400">Manage customer reviews and ratings.</p>
            </div>
            
            <TestimonialsManager initialTestimonials={testimonials || []} />
        </div>
    );
}
