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

1. **`data/site_settings.json`**: An array of objects. Crucial keys to generate:
   - `hero_title` (Stringified text)
   - `hero_subtitle` (Stringified text)
   - `site_primary_color` (Stringified Hex code like `"#2563eb"`)
   - `hero_cta_primary` (Stringified text, e.g., `"Get Started"`)
   - `hero_bg_type` (Stringified text, MUST be `"image"`)
   *Note: Format matches Supabase `site_settings` table where there is a `key`, `value` (JSON/Stringified), `label`, and `type`.*

2. **`data/services.json`**: An array of objects. Based on their brief, create 3-6 services.
   - Example schema: `{"id": 1, "title": "Service 1", "description": "Compelling desc...", "icon": "fa-solid fa-cogs", "display_order": 0}`

3. **`data/pages.json`**: An array of objects for the dynamic pages (e.g., About Us, Contact).
   - Example schema: `{"id": 1, "title": "About XYZ", "slug": "about-us", "content": "<h1>About...</h1>"}`

4. **`data/custom_sections.json`**: An array of objects. Generate fully custom HTML/Tailwind/CSS sections to make the site look incredibly premium and tailored to the client's "vibe". 
   - You must generate at least 2 custom homepage sections (where `page_id` is null). E.g., A "Why Choose Us" dynamic grid or an interactive "Our Process" timeline.
   - You must generate custom sections for the dynamic pages generated in `pages.json` by matching their IDs. 
   - *Ensure the HTML relies on Tailwind matching the `site_primary_color` or provides its own scoped `css_content` to look professional.*
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
You must generate images using your `generate_image` tool directly.
1. Generate an overarching **Hero Background Image** that matches the vibe. Do not include text in the image. Save it as `hero_bg.webp`.
2. Generate at least 3 unique, high-quality illustrations or realistic photos for the **Services** you defined. Save them as `service_1.webp`, `service_2.webp`, etc.
3. Move/save all these generated images into the `CMS_Backup_[ClientName]/storage/images/` folder.
*Tip: Ensure your JSON data (like `site_settings.json` or `services.json`) references the exact filenames you are generating!*

**Fallback Strategy (If `generate_image` is unavailable):**
If you are an LLM that cannot generate images natively (like Claude Code or a standard Chat model), do the following:
1. Identify the aesthetic intent (e.g., "Minimalist high-tech laboratory" or "Vibrant organic farm").
2. Source high-quality, copyright-free URLs from **Unsplash** (using `https://images.unsplash.com/...`) that match the brand.
3. Instead of saving physical files to `storage/images/`, update the `image_url` fields in your JSON files with these direct Unsplash URLs.
4. Ensure the `zip` command still runs even if the `storage/` folder is empty.

### 5. Packaging (The Export Phase)
1. Use your `run_command` tool to navigate to `/tmp/` and zip the directory:
   `zip -r [ClientName]_Website_Backup.zip CMS_Backup_[ClientName]/`
2. Move the newly created `.zip` file into the user's current working directory (e.g., the root of `plugintek-cms-next/`).
3. Delete the `/tmp/CMS_Backup_[ClientName]/` folder to clean up.
4. Inform the user that the site has been successfully built and point them to the specific `.zip` file they can now upload to the CMS backup restorer.
