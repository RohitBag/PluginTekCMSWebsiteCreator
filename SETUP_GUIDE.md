# PluginTekCMS Developer Manual

This guide explains how to set up, deploy, and maintain the PluginTekCMS professional business platform.

> [!IMPORTANT]
> All commands (`npm run dev`, `npm run build`, etc.) MUST be executed from the `plugintek-cms-next` directory.

## 1. Local Setup

1. **Environment Variables**: Ensure you have a `.env.local` file in the `plugintek-cms-next` directory with your Supabase credentials.
2. **Database Schema**: Follow the steps below.

## 2. Initialize Database Schema

You need to create the necessary tables and security policies in your new Supabase project.

1. Locate the file **`supabase_schema.sql`** in the root of the project.
2. Copy the entire content of that file.
3. Go to your **Supabase Dashboard** > **SQL Editor**.
4. Paste the SQL content and click **Run**.

This will create the entire database structure, RLS policies, and essential branding settings.

This will create the following tables:

* `site_settings`
* `services`
* `projects`
* `project_images`
* `custom_sections`

It also enables Row Level Security (RLS) policies.

## 3. Configure Storage Buckets

The application requires a public storage bucket to host site logos, project thumbnails, and other assets.

1. Go to your **Supabase Dashboard** > **Storage**.
2. Click **New Bucket**.
3. Name it **`images`**.
4. Toggle **Public Bucket** to **ON**.
5. Click **Create Bucket**.
6. **RLS Policies for Storage**:
    * You can set these via the UI, OR simply run this SQL in the **Supabase SQL Editor**:

```sql
-- 1. Allow public read access to images
create policy "Public Access" on storage.objects for select
using ( bucket_id = 'images' );

-- 2. Allow authenticated users to upload images
create policy "Admin Upload" on storage.objects for insert
with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- 3. Allow authenticated users to update images
create policy "Admin Update" on storage.objects for update
using ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- 4. Allow authenticated users to delete images
create policy "Admin Delete" on storage.objects for delete
using ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

## 4. Create an Admin User

The application uses Supabase Authentication. You need to create an initial user to access the admin panel.

1. Go to your **Supabase Dashboard** > **Authentication** > **Users**.
2. Click **Add User**.
3. Enter an email address (e.g., `admin@plugintek-cms.com`) and a secure password.
4. Ensure the user is "Confirmed" (manual addition usually does this).

## 5. Seed the Database

You have two options for seeding your database:

### Option A: Standard Seeding (via Admin UI)
The application includes a built-in seeder tool to populate the database with professional, generic content (found in `utils/seed_data.ts`).
1. **Navigate to the project directory**: `cd PluginTekCMSWebsiteCreator`
2. **Start the server**: `npm run dev`
3. **Login**: Go to `http://localhost:3000/login` and use your admin credentials.
4. **Seed Database**: Navigate to `http://localhost:3000/admin/seed` and click **Start Seeding**.

### Option B: Advanced Seeding (via SQL)
If you want to auto-generate dynamic pages for all your services with one click:
1. Locate **`supabase_seed.sql`** in the project root.
2. Copy and run it in your **Supabase SQL Editor**.
3. This creates generic professional content pages mapped to your service IDs.

## 6. Verify

* Wait for the "Seeding Complete!" message.
* Go back to the Admin Dashboard (`/admin/projects` or `/admin/settings`) to see the populated data.
* Your site should now display the initial content.

## 7. Note on Seed Data

The actual seed data is located in `utils/seed_data.ts`.

* If you want to customize the initial content *before* seeding (e.g., change the client name or contact info), edit `utils/seed_data.ts`.

---

## 8. Custom HTML Sections

You can inject fully custom HTML and CSS into any section on the homepage.

1. Go to **Admin Dashboard** > **Sections**.
2. Click **Add Section** or **Edit** an existing one.
3. Check the **"Use Custom HTML & CSS"** checkbox.
4. Enter your raw HTML in the **HTML Content** field.
5. Enter scoped CSS in the **Custom CSS** field.
6. Click **Save**.

> [!IMPORTANT]
> Only paste HTML and CSS from **trusted sources**. Do not paste unverified third-party code as it may be a security risk.
> You can embed iframes (booking widgets, maps, videos), feature cards, or any custom layout inside these sections.

### Premium Booking Section Template

For a high-conversion, animated booking section, use this recommended template:

#### HTML

```html
<div class="booking-premium-section">
    <div class="booking-container">
        <!-- Left: Booking Widget (No redundant boxes) -->
        <div class="booking-widget-wrapper">
            <iframe
                src="http://localhost:3001/booking-widget?tenantId=YOUR_TENANT_ID"
                class="booking-iframe"
                allowtransparency="true"
                title="Booking Calendar"
            ></iframe>
        </div>

        <!-- Right: Motivational Content -->
        <div class="booking-info">
            <div class="info-content">
                <span class="badge">Start Your Recovery</span>
                <h1>Relieve Your Pain, <br>Restore Your Life</h1>
                <p>Don't let physical discomfort hold you back. Our specialized care is designed to help you regain mobility and live a vibrant, pain-free life.</p>
                
                <ul class="features-list">
                    <li><span class="check">✓</span><span>Strategic Advisory</span></li>
                    <li><span class="check">✓</span><span>Personalized Plans</span></li>
                    <li><span class="check">✓</span><span>Modern Techniques</span></li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

#### CSS

```css
.booking-premium-section {
    position: relative;
    padding: 40px 20px;
    background: #f0f7f4; /* Fallback */
    min-height: 750px;
    display: flex;
    align-items: center;
    overflow: hidden;
}

/* Reliable Animated Background */
.booking-premium-section::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, #dcfce7 0%, #f0fdf4 40%, #ccfbf1 70%, #f0fdf4 100%);
    animation: slowSpin 25s linear infinite !important;
    z-index: 0;
}

@keyframes slowSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.booking-container {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 40px;
    align-items: center;
}

/* Kill all extra boxes and shadows */
.booking-widget-wrapper {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
}

.booking-iframe {
    width: 100%;
    height: 720px;
    border: none !important;
    background: transparent !important;
    border-radius: 20px;
    /* Only the widget itself gets a shadow, making it POP */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
}

.booking-info h1 { font-size: 42px; font-weight: 800; color: #064e3b; line-height: 1.1; margin-bottom: 20px; }
.badge { background: rgba(255, 255, 255, 0.6); padding: 4px 10px; border-radius: 4px; font-weight: 700; color: #065f46; margin-bottom: 16px; display: inline-block; font-size: 12px; }

@media (max-width: 900px) {
    .booking-container { grid-template-columns: 1fr; text-align: center; }
    .booking-info { order: -1; }
}
```

---

## 9. Content Injection API

A secure API endpoint allows you to **programmatically update** any custom section. The API also triggers an automatic **Next.js ISR cache revalidation**, so your changes appear instantly.

### Setup

Ensure your `.env.local` has the injection key:

```env
SECTION_INJECTION_KEY=your_secret_key_here
```

### Endpoint

**`POST /api/sections/inject`**

| Header          | Value                               |
| --------------- | ----------------------------------- |
| `Content-Type`  | `application/json`                  |
| `x-api-key`     | Your `SECTION_INJECTION_KEY` value  |

**Request Body:**

```json
{
  "title": "Schedule a Session",
  "content": "<div>Your HTML here</div>",
  "css_content": ".selector { color: red; }",
  "is_html": true
}
```

**Behaviour:**

* If a section with a matching title exists → it is **updated**.
* If no match is found → a **new section is created**.
* Cache is revalidated automatically after every successful call.

### Example `curl` Command

```bash
curl -X POST http://localhost:3000/api/sections/inject \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_key_here" \
  -d '{
    "title": "Schedule a Session",
    "content": "<div>Your HTML here</div>",
    "css_content": ".class { color: red; }",
    "is_html": true
  }'
```

**Successful Response:**

```json
{ "success": true, "message": "Section updated", "revalidated": true }
```

> [!IMPORTANT]
> When deploying to Vercel, add `SECTION_INJECTION_KEY` to your Vercel Environment Variables dashboard.

---

## 10. Build & Deployment

To prepare the application for production with SSG and ISR:

1. **Navigate to directory**: `cd plugintek-cms-next`
2. **Run Build**: `npm run build`
3. **Start Production**: `npm run start` (locally to test)

### Rendering Strategy (SSG/ISR)

The client-facing pages (Home and Listings) are statically generated to ensure maximum speed and SEO.

* **ISR Revalidation**: Currently set to **15 seconds** in `app/page.tsx` and `app/items/[id]/page.tsx`.
* **Static Params**: All existing listings are pre-rendered at build time.

> [!TIP]
> To change the revalidation period for production, search for `export const revalidate` in the codebase.

## 11. Deployment to Vercel

To deploy your site to the cloud, follow these steps:

1. **Push to GitHub**: Push your `plugintek-properties` repository to a private GitHub repository.
2. **Import to Vercel**:
    * Log in to [Vercel](https://vercel.com/).
    * Click **"Add New"** > **"Project"**.
    * Import your GitHub repository.
3. **Project Configuration**:
    * **Framework Preset**: Next.js
    * **Root Directory**: Select `plugintek-cms-next`.
4. **Environment Variables**:
    Add the following variables in the Vercel dashboard:

    | Variable                          | Description                       |
    | --------------------------------- | --------------------------------- |
    | `NEXT_PUBLIC_SUPABASE_URL`        | Your Supabase project URL         |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Your Supabase anonymous key       |
    | `NEXT_PUBLIC_BASE_URL`            | Your Vercel deployment URL        |
    | `SECTION_INJECTION_KEY`           | Secret key for the Injection API  |

5. **Deploy**: Click **Deploy**.

### Post-Deployment: Supabase Auth Configuration

After your site is live on Vercel:

1. Go to **Supabase Dashboard** > **Authentication** > **URL Configuration**.
2. Update **Site URL** to your Vercel URL.
3. Add `https://your-site.vercel.app/auth/callback` to **Redirect URLs**.

---

## 12. Managing Section Content

To keep the administration panel organized, content for specific sections (Hero, About, Services, etc.) is managed via the **Layout Editor**.

1. Go to **Admin Dashboard** > **Layout Editor**.
2. Locate the section you want to edit (e.g., "Hero Section").
3. Click the **Settings (gear)** icon next to that section.
4. A modal will open where you can update titles, subtitles, images, and other section-specific fields.
5. **Hero Overlay Gradient**: Within the Hero settings modal, you can configure a custom **Overlay Gradient**. This includes:
    *   **Gradient Angle**: Direction of the gradient (0-360°).
    *   **Color Start/End**: Pick colors for the top/bottom (or start/end) of the gradient.
    *   **Opacity Start/End**: Adjust transparency for a smooth fade effect over the background image.
5.  **Floating Overlay Card**: If you have a **Side Cutout Image** enabled, you can add a premium floating info card (e.g., for credentials or a short bio):
    *   **Show Floating Card**: Enable/Disable the card.
    *   **Card Icon**: Use any FontAwesome 6 class (e.g., `fa-solid fa-user-tie`).
    *   **Card Details**: Set a title (2 words recommended) and a short description.
    *   **Card Position**: Choose which corner of the image the card should float in (Bottom-Left, Bottom-Right, Top-Left, or Top-Right).
    *   **Cutout Image Size**: Choose between Small, Normal, Large, and Extra Large to control the hero image's impact.
6. Click **Save Changes** within the modal to apply the content updates.
7. Click **Save Changes** on the main Layout Editor page to save the overall layout order/visibility.

Global branding (Site Name, Colors, Logos) and Navigation labels remain in the main **Settings** page.

### 13. Reordering Header Menu Items

You can customize the order of items in the top navigation bar independently of the home page section order.

1. Go to **Admin Dashboard** > **Settings**.
2. Scroll down to the **Header Menu Layout & Design** section.
3. In the **Menu Items Visibility & Order** table, you will see **Up** and **Down** arrow buttons in the **Order** column.
4. Click the arrows to move menu items to your preferred position.
5. Click **Save Changes** at the top or bottom of the page to apply the new order.
6. The public site header will immediately reflect this custom order.

### 14. Configuring Text Logo

You can now choose between an image logo or a text-based logo.

1. Go to **Admin Dashboard** > **Settings**.
2. Under **Global Branding**, look for the **Logo Branding & Design** section.
3. Toggle the **Logo Type** button between **Image** and **Text**.
4. If **Text** is selected, you can customize:
    *   **Logo Text**: The actual text to display (e.g., your brand name).
    *   **Font Family**: Choose from premium fonts like Outfit, Cinzel, Dancing Script, etc.
    *   **Font Size & Weight**: Control the scale and boldness of the text.
    *   **Colors & Shadows**: Set independent colors and drop shadows for both **Light** and **Dark** modes to ensure perfect visibility.
5. Click **Save Changes** to apply.

### 15. Configuring Favicon (Site Icon)

You can choose between an uploaded image or a FontAwesome icon for your site's favicon.

1. Go to **Admin Dashboard** > **Settings**.
2. Under **Global Branding**, look for the **Favicon Configuration** section.
3. Toggle between **Image** and **Icon**.
4. If **Image** is selected:
    *   Upload a PNG, ICO, or SVG file.
    *   Recommended size: 32x32px or 64x64px.
5. If **Icon** is selected:
    *   **Icon Class**: Enter any FontAwesome 6 class (e.g., `fa-solid fa-star`, `fa-brands fa-react`).
    *   **Icon Color**: Choose the color for the icon.
    *   *Technical Note*: The system automatically renders the FA icon to a canvas and sets it as the browser's tab icon dynamically.
6. Click **Save Changes** to apply.

> [!TIP]
> Use a bright, recognizable color for your icon favicon to make your tab stand out among others.

> [!TIP]
> Use a high-contrast color and a subtle shadow for the dark mode text logo to make it stand out against dark backgrounds.

> [!TIP]
> This allows you to place items like "Login", "Profile", or "Contact" exactly where you want them, regardless of where their corresponding sections appear on the home page.

Appendix:
Example of HTML and CSS for appointment widget :
<div class="booking-premium-section">
    <div class="booking-container">
        <!-- Left: Booking Widget -->
        <div class="booking-widget-wrapper">
            <iframe
                src="http://localhost:3001/booking-widget?tenantId=11111111-1111-1111-1111-111111111111"
                class="booking-iframe"
                allowtransparency="true"
                title="Booking Calendar"
            ></iframe>
        </div>

        <!-- Right: Motivational Content -->
        <div class="booking-info">
            <div class="info-content">
                <span class="badge">Start Your Recovery</span>
                <h1>Relieve Your Pain, <br>Restore Your Life</h1>
                <p>Don't let physical discomfort hold you back. Our specialized care is designed to help you regain mobility and live a vibrant, pain-free life. Book your session today.</p>
                
                <ul class="features-list">
                    <li><span class="check">✓</span><span>Strategic Advisory</span></li>
                    <li><span class="check">✓</span><span>Personalized Plans</span></li>
                    <li><span class="check">✓</span><span>Modern Techniques</span></li>
                </ul>
            </div>
        </div>
    </div>
</div>

/*Section background with animated gradient*/
# section-5 {
    padding: 0px;
    background: #f0fdf4;
    position: relative;
    overflow: hidden;
    box-shadow: none !important;
    border-radius: 0 !important;
}

# section-5::before {
    content: "";
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle at center, #dcfce7 0%, #f0fdf4 40%, #ccfbf1 70%, #f0fdf4 100%);
    animation: slowSpin 25s linear infinite;
    z-index: 0;
}

@keyframes slowSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/*Kill ALL shadows*/
# section-5, #section-5 * {
    box-shadow: none !important;
}

/*Layout grid*/
# section-5 .booking-container {
    position: relative; z-index: 10;
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 60px;
    align-items: center;
    padding: 0 5px;
}

/*Iframe - no shadow, just clean rounded*/
# section-5 .booking-iframe {
    width: 100%; height: 720px;
    border-radius: 20px !important;
    border: none !important;
   padding: 0px;
}

/*Text content*/
# section-5 .badge {
    background: #d1fae5 !important;
    padding: 6px 16px; border-radius: 8px;
    font-weight: 700; color: #059669 !important;
    margin-bottom: 24px; display: inline-block;
    text-transform: uppercase; letter-spacing: 1.5px; font-size: 13px;
}

# section-5 .booking-info h1 {
    font-size: 48px; font-weight: 800;
    color: #064e3b !important; line-height: 1.1; margin-bottom: 24px;
}

# section-5 .booking-info p {
    color: #065f46 !important; font-size: 19px; line-height: 1.6; margin-bottom: 30px;
}

# section-5 .features-list { list-style: none; padding: 0; margin: 0; }

# section-5 .features-list li {
    color: #064e3b !important; font-weight: 600; font-size: 18px;
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}

# section-5 .check { color: #059669 !important; font-weight: 900; font-size: 22px; }

/*Mobile */
@media (max-width: 992px) {
    #section-5 .booking-container { grid-template-columns: 1fr; gap: 0px; text-align: center; padding: 0 0px; }
    #section-5 .booking-info { order: -1; }
    #section-5 .features-list li { justify-content: center; }
    #section-5 .booking-info h1 { font-size: 36px; }
    #section-5 .info-content { padding: 10px; }
}
/* Add this to your existing CSS*/
# section-5 .booking-widget-wrapper {
    border-radius: 20px !important;
    overflow: hidden !important;
}

# section-5 .booking-iframe {
    width: 100%;
    height: 720px;
    border: none !important;
    display: block;
}

# section-5 .features-list li {
    color: #064e3b !important;
    font-weight: 600;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
}

# section-5 .check {
    /*Circle decoration*/
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
    background: #059669 !important;
    color: #ffffff !important;
    border-radius: 50% !important;
    font-size: 14px !important;
    font-weight: 900 !important;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.35) !important;
}
