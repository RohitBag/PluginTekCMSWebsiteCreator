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

        -- Generate HTML content
        html_content := '
<div class="space-y-6">
    <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
        ' || coalesce(svc.description, '') || '
    </p>
    
    <div class="h-px bg-gray-200 dark:bg-zinc-800 my-8"></div>
    
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Comprehensive Care for ' || svc.title || '</h2>
    <p class="text-gray-600 dark:text-gray-400 leading-loose">
        Our dedicated medical professionals provide highly specialized, patient-centered care for <strong>' || svc.title || '</strong>. We believe in holistic treatments designed to restore your health and improve your overall well-being. Using the latest medical advancements and evidence-based protocols, our personalized treatment plans are tailored to meet your unique health needs and ensure the best possible outcomes.
    </p>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div class="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Expert Specialists</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Highly qualified experts with years of clinical experience.</p>
        </div>
        <div class="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
            <h3 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Advanced Treatments</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Utilizing state-of-the-art medical technology and therapies.</p>
        </div>
    </div>
    
    <div class="mt-10 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-center">
        <h3 class="text-xl font-bold text-amber-900 dark:text-amber-500 mb-2">Ready to book a consultation?</h3>
        <p class="text-amber-700 dark:text-amber-600 mb-4">Contact us today to discuss your requirements.</p>
        <a href="/#contact" class="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors">Get Started</a>
    </div>
</div>';

        -- Insert or ignore
        INSERT INTO public.pages (title, slug, content, image_url)
        VALUES (
            svc.title, 
            new_slug, 
            html_content, 
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80'
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
