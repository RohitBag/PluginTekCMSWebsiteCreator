-- 1. Insert search/contact widget into custom_sections
-- We use a high display_order to typically put it at the end
INSERT INTO public.custom_sections (title, content, is_html, display_order)
VALUES (
  'PluginTek Contact Widget',
  '<section id="plugintek-widget" class="w-full bg-white dark:bg-black">
    <style>
      #plugintek-iframe {
        width: 100%;
        height: 800px; /* Adjusted height for desktop */
        border: none;
        background: transparent;
        display: block;
      }
      @media (max-width: 768px) {
        #plugintek-iframe {
          height: 1250px; /* Adjusted height for mobile stacking */
        }
      }
    </style>
    <div class="container mx-auto px-4">
      <iframe
        id="plugintek-iframe"
        src="https://your-chatbot-ui.vercel.app/widget/contact-2?tenantId=11111111-1111-1111-1111-111111111111"
        allowtransparency="true"
        title="PluginTek Contact Widget"
      ></iframe>
    </div>
  </section>',
  true,
  99
);

-- 2. Update home_layout in site_settings to include this new section
-- Note: This is an example of how to manually add it to the JSON array if you have a custom layout saved.
-- You can also just enable it via the Admin Layout Editor after running the above INSERT.

/*
UPDATE public.site_settings
SET value = value || jsonb_build_array(
  jsonb_build_object(
    'id', 'custom_section_' || (SELECT id FROM public.custom_sections WHERE title = 'PluginTek Contact Widget' ORDER BY id DESC LIMIT 1),
    'type', 'custom_section',
    'label', 'PluginTek Contact Widget',
    'enabled', true
  )
)
WHERE key = 'home_layout';
*/
