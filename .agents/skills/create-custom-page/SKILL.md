---
name: create-custom-page
description: How to create a new custom page layout with associated services and sections securely using a Supabase SQL script.
---

# Creating a Custom Page Layout

When the user asks to create a new page with custom sections (like a hero banner, rich text, or global components), follow these steps rather than attempting to insert via a backend API, because Row Level Security (RLS) is strictly enforced on the `pages` and `custom_sections` tables.

## Steps

1. **Understand the Requirement**: 
   Determine the page slug, page title, and the type of custom sections the user wants (e.g., custom HTML banner, rich text with side images). Look up any required local images (e.g., inside `public/images/pain-banners/` or `public/icons/`).

2. **Check Global Sections**:
   If the user wants global sections attached (like "Our Work Process" or "Why Us Component"), you must query or read the `supabase_schema.sql` database dump to find their global IDs (e.g., 10 and 5).

3. **Generate a DB Script**:
   Since RLS prevents direct Node script insertion with the anon key, you will craft an SQL migration file (e.g. `supabase_add_[slug].sql`) containing a PL/pgSQL block (`DO $$ ... END $$;`).

4. **Constructing the PL/pgSQL Block**:
   - `INSERT` into `public.services` for visibility in the services menu.
   - `INSERT` into `public.pages` representing the core page routing shell, and grab the `new_page_id` using `RETURNING id INTO`.
   - `INSERT` into `public.custom_sections` using the `new_page_id` for every unique section (e.g., full width HTML banners, text blocks) saving their generated `id`s.
   - Finally, `UPDATE` the `public.pages` table to set the `layout` JSONB column. Use `jsonb_build_array` and `jsonb_build_object` to assemble the array of layout items (combining your newly generated custom section IDs with any global section IDs) in the desired display order.

5. **Provide the Script to the User**:
   Save the `.sql` script in the root directory and explicitly instruct the user to execute it in their Supabase SQL editor to deploy the new page, as we don't have direct service-role execution capabilities locally.

> [!TIP]
> Use `.agents/skills/create-custom-page/examples/supabase_add_knee_pain.sql` as your perfect reference template for mapping this logic.
