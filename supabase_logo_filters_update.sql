-- SQL Migration: Add Logo Filter Settings
-- This script adds default settings for site logo CSS filters (brightness, grayscale, drop shadow)

INSERT INTO public.site_settings (key, value, label, type)
VALUES 
  ('logo_light_brightness', '"1"', 'Logo Brightness (Light)', 'text'),
  ('logo_light_grayscale', '"0"', 'Logo Grayscale (Light)', 'text'),
  ('logo_light_drop_shadow', '"none"', 'Logo Drop Shadow (Light)', 'text'),
  ('logo_dark_brightness', '"1"', 'Logo Brightness (Dark)', 'text'),
  ('logo_dark_grayscale', '"0"', 'Logo Grayscale (Dark)', 'text'),
  ('logo_dark_drop_shadow', '"none"', 'Logo Drop Shadow (Dark)', 'text')
ON CONFLICT (key) DO NOTHING;
