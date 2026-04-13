# Developer Procedure Manual: Plugintek Local Website Builder

This document provides instructions on how to deploy, start, and manage the **Plugintek Local Website Builder (CMS Lite)**.

## 📥 Prerequisites
- **Node.js**: v18 or higher (Recommended v20+)
- **NPM**: v9 or higher

## 🚀 Getting Started

### 1. Installation
Navigate to the project directory and install dependencies:
```bash
cd plugintek-local-website-builder
npm install
```

### 2. Development Mode
Start the local development server with a custom port to avoid conflicts with the main CMS:
```bash
npm run dev -- --port 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 3. Production Build & Export
To generate a static version of the builder that can be served from any static host (e.g., Vercel, GH Pages):
```bash
npm run build
```
The output will be in the `out/` directory.

## 🛠 Project Structure
- `src/app/page.tsx`: The main CMS Shell (Split Pane).
- `src/store/SiteContext.tsx`: Central state engine (No database).
- `src/lib/generator.ts`: The "Engine" that converts state into HTML.
- `src/lib/exporter.ts`: Handles ZIP Save/Restore logic.
- `src/components/admin/sections/`: Individual section editors (Hero, About, etc.).

## 💾 Data Persistence & Export
- **Session Auto-Save**: Progress is saved to `localStorage` automatically.
- **Hard Backup**: Use the **"Save locally"** button to download a ZIP containing:
    - Multiple `.html` files: One for each page created (e.g., `index.html`, `about.html`).
    - `/assets/`: Physical files extracted from your Base64 uploads.
    - `cms_config.json`: Project state for future editing.
- **Restoration**: Use the **"Restore"** button and select your previously saved ZIP. All pages and content will be restored.
- **Dark Mode Preview**: Use the Moon/Sun toggle in the preview pane to test responsive dark-mode styling.

## 🏗 Deploying to Vercel
1. Upload the `plugintek-local-website-builder` folder to a GitHub repository.
2. Connect to Vercel.
3. **Build Command**: `npm run build`
4. **Output Directory**: `out`
5. **Install Command**: `npm install`

---
*Created by Antigravity AI for Plugintek Project.*
