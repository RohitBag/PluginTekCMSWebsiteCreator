---
description: Header Menu Configuration Migration
---
-- Add header_menu_config to site_settings
INSERT INTO public.site_settings (key, value, label, type)
VALUES (
  'header_menu_config',
  '{
    "order": ["hero", "about", "items", "services", "portfolio", "contact", "login", "wishlist", "profile"],
    "items": {
      "hero": { "desktop": "show", "mobile": "show" },
      "about": { "desktop": "show", "mobile": "show" },
      "items": { "desktop": "show", "mobile": "show" },
      "services": { "desktop": "show", "mobile": "show" },
      "portfolio": { "desktop": "show", "mobile": "show" },
      "contact": { "desktop": "show", "mobile": "show" },
      "login": { "desktop": "show", "mobile": "show" },
      "wishlist": { "desktop": "show", "mobile": "show" },
      "profile": { "desktop": "show", "mobile": "show" }
    },
    "desktop": {
      "fontSize": "16",
      "fontWeight": "500",
      "alignment": "right",
      "fontFamily": "Outfit"
    },
    "mobile": {
      "fontSize": "14",
      "fontWeight": "500",
      "alignment": "left",
      "fontFamily": "Outfit"
    },
    "moreLabel": "More"
  }'::jsonb,
  'Header Menu Configuration',
  'json'
) ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  type = EXCLUDED.type;
