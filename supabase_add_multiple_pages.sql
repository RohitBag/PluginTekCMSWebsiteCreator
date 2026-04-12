-- supabase_add_multiple_pages.sql
-- Bulk inserts custom pages and layouts for multiple pain points

DO $$
DECLARE
    page_data jsonb;
    new_page_id BIGINT;
    banner_id BIGINT;
    text_id BIGINT;
    service_id BIGINT;
    pages_array jsonb := '[
        {"title": "Back Pain", "slug": "back_pain", "icon": "back.png", "banner": "back_pain.jpeg", "fa": "fas fa-bone"},
        {"title": "Shoulder Pain", "slug": "shoulder_pain", "icon": "shoulder.png", "banner": "shoulder_pain.jpeg", "fa": "fas fa-child"},
        {"title": "Neck Pain", "slug": "neck_pain", "icon": "neck.png", "banner": "neck_pain.jpeg", "fa": "fas fa-user-injured"},
        {"title": "Headache", "slug": "headache", "icon": "headache.png", "banner": "headache.jpeg", "fa": "fas fa-brain"},
        {"title": "Hip Pain", "slug": "hip_pain", "icon": "hip.png", "banner": "hip_pain.jpeg", "fa": "fas fa-walking"},
        {"title": "Wrist Pain", "slug": "wrist_pain", "icon": "wrist.png", "banner": "wrist_pain.jpeg", "fa": "fas fa-hand"},
        {"title": "Foot & Ankle Pain", "slug": "foot_ankle", "icon": "foot-ankle.png", "banner": "foot_ankle.jpeg", "fa": "fas fa-shoe-prints"},
        {"title": "Elbow Pain", "slug": "elbow_pain", "icon": "elbow.png", "banner": "elbow_pain.jpeg", "fa": "fas fa-hand-holding"},
        {"title": "Chest Pain", "slug": "chest_pain", "icon": "chest.png", "banner": "chest_pain.jpeg", "fa": "fas fa-heartbeat"}
    ]';
BEGIN
    FOR page_data IN SELECT * FROM jsonb_array_elements(pages_array)
    LOOP
        -- 1. Create Service
        INSERT INTO public.services (title, description, page_url, icon)
        VALUES (
            page_data->>'title', 
            'Comprehensive care for ' || lower(page_data->>'title'), 
            '/p/' || (page_data->>'slug'),
            page_data->>'fa'
        )
        RETURNING id INTO service_id;
        
        -- 2. Create Page
        INSERT INTO public.pages (title, slug, content, image_url, layout)
        VALUES (
            page_data->>'title', 
            page_data->>'slug', 
            '', 
            '/images/pain-banners/' || (page_data->>'banner'),
            '[]'::jsonb
        ) RETURNING id INTO new_page_id;

        -- 3. Create Banner Section
        INSERT INTO public.custom_sections (page_id, title, is_html, content, css_content, display_order)
        VALUES (
            new_page_id,
            (page_data->>'title') || ' Banner',
            true,
            '<div class="full-width-banner">
  <img src="/images/pain-banners/' || (page_data->>'banner') || '" alt="' || (page_data->>'title') || ' Banner" class="banner-img">
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
            (page_data->>'title') || ' Treatment',
            false,
            'Relieve your pain and reclaim your mobility with the expert care of our specialized healthcare professionals. Specializing in ' || (page_data->>'title') || ' treatments, our clinic provides comprehensive and personalized care plans. We believe in a holistic approach to healing, combining advanced medical diagnostics with tailored rehabilitation to ensure long-term recovery and improved quality of life. Don’t let discomfort hold you back any longer—take the first step toward a pain-free future today.',
            '/icons/pain-points/' || (page_data->>'icon'),
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
    END LOOP;
END $$;
