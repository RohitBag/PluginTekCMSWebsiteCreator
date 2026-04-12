-- supabase_add_knee_pain.sql
-- This script creates the "Knee Pain" service, page, and custom sections
-- It mirrors the layout of the /p/joint-musculoskeletal page.

DO $$
DECLARE
    new_page_id BIGINT;
    banner_id BIGINT;
    text_id BIGINT;
    service_id BIGINT;
BEGIN
    -- 1. Create Service
    INSERT INTO public.services (title, description, page_url)
    VALUES ('Knee Pain', 'Comprehensive care for knee pain and injuries', '/p/knee_pain')
    RETURNING id INTO service_id;
    
    -- 2. Create Page
    INSERT INTO public.pages (title, slug, content, image_url, layout)
    VALUES (
        'Knee Pain', 
        'knee_pain', 
        '', 
        '/images/pain-banners/knee_pain_banner.png',
        '[]'::jsonb
    ) RETURNING id INTO new_page_id;

    -- 3. Create Banner Section
    INSERT INTO public.custom_sections (page_id, title, is_html, content, css_content, display_order)
    VALUES (
        new_page_id,
        'Knee Pain Banner',
        true,
        '<div class="full-width-banner">
  <img src="/images/pain-banners/knee_pain_banner.png" alt="Knee Pain Banner" class="banner-img">
</div>',
        '

.full-width-banner{
  width: 100%;
  overflow: scroll;
}

.banner-img {
  width: 100%;
  height: 100%;
  /* This prevents the image from looking squashed */
  object-fit: cover; 
  /* This ensures the center of the image stays visible */
  object-position: center;
  display: block;
}',
        1
    ) RETURNING id INTO banner_id;

    -- 4. Create Text Section
    INSERT INTO public.custom_sections (page_id, title, is_html, content, image_url, display_order)
    VALUES (
        new_page_id,
        'Knee Pain Treatment',
        false,
        'Relieve your pain and reclaim your mobility with the expert care of Dr. Mahati. Specializing in Knee Pain treatments, our clinic provides comprehensive care for conditions ranging from arthritis and ligament tears to sports-related injuries. We believe in a holistic approach to healing, combining advanced medical diagnostics with personalized rehabilitation plans to ensure long-term recovery and improved quality of life. Don’t let knee discomfort hold you back any longer—take the first step toward a pain-free future today.',
        '/icons/pain-points/knee.png',
        2
    ) RETURNING id INTO text_id;

    -- 5. Update Layout for Page (attaching global sections 10 and 5 as well)
    UPDATE public.pages 
    SET layout = jsonb_build_array(
        jsonb_build_object('id', banner_id, 'enabled', true),
        jsonb_build_object('id', text_id, 'enabled', true),
        jsonb_build_object('id', 10, 'enabled', true),
        jsonb_build_object('id', 5, 'enabled', true)
    )
    WHERE id = new_page_id;

END $$;
