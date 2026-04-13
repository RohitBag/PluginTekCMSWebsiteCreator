# 🚀 PluginTekCMS
**The ultimate modular foundation for modern business websites.**

PluginTekCMS is a robust, developer-centric content management system designed for speed, flexibility, and high-end aesthetics. Built on the latest **Next.js 15 (App Router)** and **Supabase**, it provides a "clean slate" template that can be transformed into any business platform—from real estate galleries and specialized consulting portals to creative portfolios.

### ✨ Key Features
*   **🏗️ Dynamic Page Builder**: Drag-and-drop sectional layout management with support for custom HTML/CSS injections.
*   **🔐 Seamless Auth**: Fully integrated authentication system powered by Supabase Auth, featuring user profiles and bookmarking.
*   **🛠️ Pro Admin Dashboard**: Manage site globally—from Hero typography and branding filters to testimonials and multi-image project galleries.
*   **🚀 Built for Performance**: Edge-ready with Next.js Server Components, Turbopack support, and optimized image handling.
*   **🔍 SEO-First Architecture**: Automated dynamic `sitemap.xml` and `robots.txt` generation with full metadata control for every page.
*   **🎨 Premium UI**: Modern, glassmorphic design system with full dark mode support and curated accessibility themes.

### 💻 Tech Stack
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
*   **Database & Auth**: [Supabase](https://supabase.com/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

### 🏁 Quick Start
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/RohitBag/PluginTekCMSWebsiteCreator.git
    cd PluginTekCMSWebsiteCreator
    ```
2.  **Environment Setup**:
    Rename `.env.example` to `.env.local` and add your required Supabase credentials (`URL`, `ANON_KEY`, `SERVICE_ROLE`).
3.  **Database Initialization**:
    - Run the provided **`supabase_schema.sql`** in your Supabase SQL Editor to set up the structure.
    - (Optional) Run **`supabase_seed.sql`** to populate the database with generic demonstration content and auto-generated service pages.
4.  **Run Locally**:
    ```bash
    npm install
    npm run dev
    ```

### 📖 Documentation
For more detailed instructions on deployment, backup management, and customization, please refer to the [Developer Setup Guide](./SETUP_GUIDE.md).

### 🏷️ Topics
`nextjs-15` `supabase` `cms` `headless-cms` `website-builder` `typescript` `tailwindcss` `saas-template` `open-source`
