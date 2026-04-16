---
name: generate_client_site
description: Generates a complete CMS site backup zip containing AI-written JSON data and generated images, based on a client's markdown brief.
---

# 🎯 Objective

Your goal is to act as an elite web designer and copywriter. You will read a provided markdown brief for a new client, and use that information to generate a complete `.zip` file containing structure JSON data and AI-generated images that can be directly imported into the Next.js CMS.

# 📋 Execution Steps

### 1. Ingest Data
When the user invokes this skill, they must provide a target markdown file (e.g., `client_brief.md`).
- Use the `view_file` tool to read the contents of the brief.

### 2. Workspace Setup
Create a temporary directory structure in `/tmp/` named `CMS_Backup_[ClientName]/`. Inside it, create two subdirectories:
- `data/`
- `storage/images/`

### 3. Generate JSON Data (The Copywriting phase)
You must generate raw JSON data that strictly matches the CMS database schema. Use your `write_to_file` tool to create the following files in the `data/` folder. Use the client's brief to write highly persuasive, SEO-optimized copy, picking hex codes and FontAwesome classes that match their brand vibe.

**Required Files to Generate:**

1. **`data/site_settings.json`**: An array of objects. **CRITICAL: You must include comprehensive defaults to prevent the site from breaking or appearing empty after a restore.**
    - `hero_title`, `hero_subtitle`, `hero_cta_primary`, `hero_badge_text`, `hero_text_align` (Standard strings, e.g., `"My Title"`)
    - `site_primary_color` (Hex string, e.g., `"#2563eb"`)
    - `hero_bg_type` (String, MUST be `"image"`)
    - **Contrast Overlays:** You MUST include `hero_overlay_color_start` (`"#000000"`), `hero_overlay_color_end` (`"#000000"`), and `hero_overlay_opacity_start` (`"60"`).
    - **About Section:** Include `about_image_url`, `about_title`, `about_subtitle`, and `about_text`.
    - **Home Layout:** Ensure `home_layout` is an **actual JSON array**, NOT a stringified JSON string.
      - *ID Format:* Standard sections use their slugs (e.g., `"hero"`, `"about"`, `"services"`).
      - *Custom IDs:* Custom sections MUST use the format `"custom_section_[ID]"` (e.g., `"custom_section_1"`) to match the Next.js frontend logic.
      - *Example:* `[{"id": "hero", "enabled": true}, {"id": "custom_section_1", "enabled": true}]`.
    *Note: Format matches Supabase site_settings table where there is a key, value (JSONB), label (text), and type (text).*

2. **`data/services.json`**: An array of objects. Based on their brief, create 3-6 services. Ensure the `page_url` values exactly match the slugs you will create in `pages.json` (e.g., `"/p/about-us"`, `"/p/digital-marketing"`).

3. **`data/pages.json`**: An array of objects for the dynamic pages (e.g., About Us, Contact, specific Services). Generate a dedicated dynamic page for EVERY major service or solution listed. The identifier column for the URL is **`slug`**, NOT `page_url` (must match the schema exactly, e.g., `{"slug": "about-us"}`).

4. **`data/custom_sections.json`**: An array of objects. Generate fully custom HTML/Tailwind/CSS sections to make the site look incredibly premium and tailored to the client's "vibe". **CRITICAL: The column for HTML content is `content` (not `html_content`), and the `title` column is NOT NULL/Required.**
   - You must generate at least 2 custom homepage sections (where `page_id` is null). E.g., A "Why Choose Us" dynamic grid or an interactive "Our Process" timeline.
   - You must generate custom sections for the dynamic pages generated in `pages.json` by matching their IDs. 
   - **STRICT CSS CONTRAST RULE:** You MUST ensure custom HTML relies on Tailwind CSS classes that explicitly support both dark and light modes. Use `bg-white dark:bg-slate-900 text-slate-900 dark:text-white`. NEVER use just white text on a transparent background, as it will be invisible in light mode.
   - **Chatbot Integration:** If the client brief requests a chatbot, generate a custom section with `is_html: true` using this exact embed code, replacing the `tenantId` and `BASE_URL`:
     `<iframe src="[YOUR_CHATBOT_BASE_URL]/widget?tenantId=[YOUR_TENANT_ID]" style="position: fixed; bottom: 0; right: 0; width: 450px; height: 750px; border: none; z-index: 999999; background: transparent;" allow="microphone" title="PluginTek AI Assistant"></iframe>`
     - *CRITICAL:* If the client brief asks for a chatbot but forgets to provide the `BASE_URL` or `tenantId`, **stop generating the JSON**. Ask the user for the missing details before proceeding. Do not leave placeholder brackets in the final file.

5. **Empty Arrays** for tables that are not immediately used:
   - `data/projects.json` -> `[]`
   - `data/project_images.json` -> `[]`
   - `data/items.json` -> `[]`
   - `data/item_images.json` -> `[]`
   - `data/section_images.json` -> `[]`

### 4. Create Media (The Design Phase)
Attemp to use your `generate_image` tool to generate custom, high-end conceptual background images and service images for the brand. Save them into `storage/images/` and reference their relative URLs (`/storage/v1/object/public/images/hero_bg.webp`) in your JSON files.

**CRITICAL FALLBACK (Unsplash):**
If `generate_image` fails due to capacity limits, errors, or if you simply cannot generate images, **YOU MUST IMMEDIATELY FALL BACK TO UNSPLASH URLs**. 
1. Identify the aesthetic intent (e.g., "Minimalist high-tech laboratory", "Corporate boardroom").
2. Source high-quality, copyright-free URLs directly from **Unsplash** (e.g., `https://images.unsplash.com/photo-12345?auto=format&fit=crop&q=80&w=1200`).
3. Place these direct URLs into your `site_settings.json` (for `hero_bg_image_url`, `about_image_url`) and `pages.json` (for `image_url`). Do not save physical placeholder files if using Unsplash.

### 5. Packaging (The Export Phase)
1. **CRITICAL ZIP STRUCTURE:** The CMS expects `data/` and `storage/` to be at the *root* of the ZIP file. You must navigate INTO the temporary directory before zipping.
Use your `run_command` tool to execute:
```bash
cd /tmp/CMS_Backup_[ClientName] && zip -r ../[ClientName]_Website_Backup.zip . && mv ../[ClientName]_Website_Backup.zip /path/to/project/root/
```
2. Verify the ZIP file is in the project root.
3. Delete the `/tmp/CMS_Backup_[ClientName]/` folder to clean up.
4. Inform the user that the site has been successfully built and point them to the specific `.zip` file they can now upload to the CMS backup restorer.
