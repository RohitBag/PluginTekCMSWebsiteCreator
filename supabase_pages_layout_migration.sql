-- Migration to add specialized sections and layouts to dynamic pages

-- 1. Add page_id to custom_sections so a section can exclusively belong to a single page
alter table public.custom_sections 
add column if not exists page_id bigint references public.pages(id) on delete cascade;

-- 2. Add layout column to pages table
alter table public.pages 
add column if not exists layout jsonb default '[]'::jsonb;
