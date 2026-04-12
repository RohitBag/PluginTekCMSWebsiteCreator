# Alternative Plan: The "Local AI Site Generator" Skill

This plan shifts the AI generation from a SaaS web feature to a **Developer Workflow Tool**. Instead of the client pushing a button on their website, *you* (the agency) use a Google Antigravity Skill locally to generate the site before handing it over.

## 1. The Core Concept

You act as the orchestrator. When you land a new client (e.g., XYZ Robotics):
1. You clone your master CMS repository.
2. You set up a fresh Vercel and Supabase instance and link them via `.env.local`.
3. You write a simple `XYZ_brief.md` file describing the client's business.
4. You tell Antigravity: *"Run the Site Generator Skill using XYZ_brief.md"*.
5. Antigravity does all the writing, image generation, and JSON formatting locally, and spits out a `client_backup.zip`.
6. You log into the client's fresh admin dashboard, use the **Restore** feature we just built to upload the zip, and the site is instantly finished.

---

## 2. How the Antigravity Skill Works

A "Skill" is simply a markdown file ending in `.md` placed in your `.agents/skills/` directory that teaches the AI how to perform a highly specific, repeatable workflow. 

We would create a skill named `generate_client_site.md`.

### Step 1: Ingestion & Planning
The skill instructs the AI to read the provided `client_brief.md`. The AI acts as a copywriter and web designer, planning out the "Home Page Layout" (Hero, Services, About, Items, Contact).

### Step 2: Data Generation (JSON Generation)
The skill provides the exact JSON schema of your database tables to the AI. The AI uses its code-generation abilities to write out raw JSON files for each table locally (e.g., `data/site_settings.json`, `data/services.json`, `data/pages.json`). 
*   It generates persuasive copy.
*   It picks a cohesive color scheme and FontAwesome UI icons based on the client's industry.

### Step 3: Media Creation (Local AI Image Generation)
This is where the local setup shines. Because you are using Antigravity, the AI has access to the built-in image generator tool.
*   The skill instructs the AI to use its `generate_image` tool to create the hero background, gallery pictures, and specific service illustrations.
*   It saves these high-quality WebP/PNG files into a local folder (e.g., `storage/images/hero.webp`).

### Step 4: Packaging (The Output)
Finally, the skill instructs the AI to run a local bash command to zip the generated files into the exact structure required by our CMS Restore tool:
```bash
zip -r XYZ-Robotics-Site.zip data/ storage/
```
The AI announces the task is complete and provides you with the path to the Zip file.

---

## 3. Advantages of this Local Workflow

Compared to the "Centralized Brain" SaaS model, this approach has massive benefits for an agency model:

1. **Zero Infrastructure Costs:** You don't need to build, host, or maintain a secure central API server.
2. **Instant Image Generation:** You don't need to pass around API keys for Banana.dev or Unsplash. Google Antigravity handles the image generation natively using its existing toolkit.
3. **No Client Abuse:** Since the clients don't have access to the "Generate" button, you have 0% risk of clients spamming an AI tool and racking up API bills.
4. **Infinite Flexibility:** Because this happens in a chat interface with you, if you don't like a specific image or paragraph the AI generated, you can just say *"Change the third service image to look more industrial and regenerate the zip,"* before you actually import it to the client's site.

## 4. Expanding the Idea: "Agentic Re-Theming"

Since this happens locally, we can take it a step further. We can create a second skill called `re_theme_site.md`. 

Suppose a client says, *"We are rebranding to a darker, cyberpunk theme."* You can export their *current* site zip using the CMS, hand it to Antigravity, and use the re-theme skill. The AI will unzip it, read their existing JSON, rewrite the `site_settings` colors, apply image filters, generate new darker images to replace the old ones, and spit out an updated zip for you to import back in.

---

## 5. How to Use This Skill (Workflow & Sample Prompts)

To execute this plan, you need to create the skill instructions file inside your project (`.agents/skills/generate_client_site.md`). 

### Creating the Skill File

The skill file teaches Antigravity the exact JSON schema it needs to produce. It should look something like this:

```yaml
---
name: generate_client_site
description: Generates a complete CMS site backup zip from a client brief.
---

# Instructions
1. Read the provided markdown file containing the client details.
2. In a temporary folder called `tmp_site_gen/`, structure two folders: `data/` and `storage/images/`.
3. Create raw JSON files in `data/` for `site_settings` (mapping hero colors, titles), `services` (array of service objects), and `pages`. 
4. Use your `generate_image` tool to create a hero background and at least 3 service icons. Save them into `storage/images/`.
5. Zip the `tmp_site_gen` folder into `[ClientName]_Backup.zip` and present the file path to the user.
```

### The Developer Workflow

**1. Write the Client Brief:**
You create a quick markdown file on your computer named `client_brief.md`:

```markdown
# XYZ Robotics
**Industry:** Industrial Manufacturing Automation
**Vibe/Tone:** High-tech, ultra-modern, metallic, trustworthy.
**Colors preferred:** Dark mode, with neon blue accents.

**Services we offer:**
1. Automated Assembly Lines
2. High-precision Welding Arms
3. AI Vision Inspection

**Contact:** 1-800-ROBOTS, info@xyzrobotics.com
```

**2. The Antigravity Prompt:**
You open up Google Antigravity in your terminal or IDE and run this exact prompt:

> "Hey Antigravity, I have a new client. Please use the `generate_client_site` skill on the file `client_brief.md` to create the site backup for me."

### What Happens Next
1. Antigravity reads the brief.
2. It generates sleek, neon-blue hex codes and "high-tech" copy, saving them to `site_settings.json`.
3. It uses its image generator tool to create pictures of "Industrial welding arms with blue lasers" and places them in the `images` folder.
4. It zips everything up and says: *"Done! Your site is ready at XYZ-Robotics_Backup.zip."*
5. You go to the client's fresh Vercel CMS, click **Restore**, upload the zip, and the site is live.
