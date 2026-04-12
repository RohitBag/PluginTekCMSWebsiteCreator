-- Migration: Add Custom HTML and CSS support to Custom Sections
-- Date: 2026-03-18

ALTER TABLE public.custom_sections 
ADD COLUMN IF NOT EXISTS is_html BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS css_content TEXT;

-- Comment for clarity
COMMENT ON COLUMN public.custom_sections.is_html IS 'If true, the content field will be rendered as raw HTML instead of plain text/embed.';
COMMENT ON COLUMN public.custom_sections.css_content IS 'Custom CSS specifically for this section, injected when is_html is true.';
