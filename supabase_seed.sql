-- PluginTekCMS Demo Seed Script
-- This script generates dynamic pages for existing services using a generic professional template.
-- Use this AFTER supabase_schema.sql if you want to populate your site with demonstration content.

DO $$
DECLARE
    svc RECORD;
    new_slug TEXT;
    html_content TEXT;
BEGIN
    FOR svc IN SELECT * FROM public.services LOOP
        -- Generate slug
        new_slug := regexp_replace(lower(svc.title), '[^a-z0-9]+', '-', 'g');
        new_slug := trim(both '-' from new_slug);

        -- Generate generic professional HTML content
        html_content := '
<div class="space-y-6">
    <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
        ' || coalesce(svc.description, 'Expert solutions tailored to your unique organizational requirements.') || '
    </p>
    
    <div class="h-px bg-gray-200 dark:bg-zinc-800 my-8"></div>
    
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Excellence in ' || svc.title || '</h2>
    <p class="text-gray-600 dark:text-gray-400 leading-loose">
        Our dedicated specialists provide highly specialized, results-oriented support for <strong>' || svc.title || '</strong>. We believe in strategic methodologies designed to optimize your operations and improve your overall competitive edge. Using the latest industry advancements and evidence-based protocols, our personalized strategies are tailored to meet your unique scale and ensure the best possible outcomes.
    </p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div class="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Senior Partners</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Highly qualified experts with extensive international industry experience.</p>
        </div>
        <div class="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Technical Excellence</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Utilizing state-of-the-art workflow tools and analytical frameworks.</p>
        </div>
    </div>
    
    <div class="mt-10 p-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 dark:border-primary/20 text-center">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to scale your impact?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Contact us today to discuss your project requirements with our leadership team.</p>
        <a href="/#contact" class="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">Get Started</a>
    </div>
</div>';

        -- Insert page
        INSERT INTO public.pages (title, slug, content, image_url)
        VALUES (
            svc.title, 
            new_slug, 
            html_content, 
            '/placeholder.jpg'
        )
        ON CONFLICT (slug) DO UPDATE SET 
            content = EXCLUDED.content, 
            image_url = EXCLUDED.image_url,
            updated_at = EXCLUDED.updated_at;

        -- Link back to service
        UPDATE public.services
        SET page_url = '/p/' || new_slug
        WHERE id = svc.id;

    END LOOP;
END $$;
