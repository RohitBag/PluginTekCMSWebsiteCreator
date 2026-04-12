-- Migration: Add Text Logo Settings
-- This script adds configuration keys for the brand new Text Logo feature.

INSERT INTO public.site_settings (key, value, label, type)
VALUES 
  ('logo_type', '"image"'::jsonb, 'Logo Display Type', 'text'),
  ('logo_text', '"Brand Name"'::jsonb, 'Logo Text Content', 'text'),
  ('logo_text_font', '"Outfit"'::jsonb, 'Logo Text Font', 'text'),
  ('logo_text_size', '"24"'::jsonb, 'Logo Text Size (px)', 'text'),
  ('logo_text_weight', '"700"'::jsonb, 'Logo Text Weight', 'text'),
  ('logo_text_color_light', '"#000000"'::jsonb, 'Logo Text Color (Light)', 'text'),
  ('logo_text_color_dark', '"#ffffff"'::jsonb, 'Logo Text Color (Dark)', 'text'),
  ('logo_text_shadow_light', '"none"'::jsonb, 'Logo Text Shadow (Light)', 'text'),
  ('logo_text_shadow_dark', '"none"'::jsonb, 'Logo Text Shadow (Dark)', 'text')
ON CONFLICT (key) DO NOTHING;

-- Update logo_text with site_name if it exists
UPDATE public.site_settings 
SET value = (SELECT value FROM public.site_settings WHERE key = 'site_name')
WHERE key = 'logo_text' AND (SELECT count(*) FROM public.site_settings WHERE key = 'site_name') > 0;
