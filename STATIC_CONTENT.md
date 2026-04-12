# Project: Static & Hardcoded Content List

This document lists all the hardcoded, default, and static content currently present in the codebase. This is a reference for developers to know which values should be updated during project initialization.

## 🏢 Site Identity & Branding
*   **Default Site Name:** CMS Website Creator
*   **Logos:** 
    *   `/website_logo.png` (Standard/Light)
    *   `/website_logo_Inverted.png` (Dark Mode)
*   **Favicon:** `/favicon.ico`
*   **Tax IDs (Placeholder):** `[YOUR-TAX-ID]`
*   **Business Registration (Placeholder):** `[YOUR-REG-ID]`

## 📞 Contact Information
*   **Primary Email:** `contact@example.com`
*   **Phone Numbers:** 
    *   `+1 (555) 010-8888`
    *   `+1 (555) 010-9999`
*   **Website URL:** `www.your-domain.com`
*   **Office Address:** 123 Business Way, Suite 100, City, Country, ZIP.
*   **Social Media:**
    *   **Facebook:** `https://facebook.com/yourpage`
    *   **Instagram:** `https://instagram.com/yourprofile`

## 📝 Site Copy (Hardcoded Defaults & Fallbacks)
These values are used when database settings are missing.

### Hero Section
*   **Heading:** "Transform your digital presence"
*   **Subtitle:** "Your trusted partner for modern web solutions and content management."
*   **Call to Action Buttons:** "Get in Touch", "Explore More"

### About Section
*   **Main Heading:** "About Our Platform"
*   **Profile Heading:** "Company Profile"
*   **Badge:** "Our Identity"

### Services Section
*   **Heading:** "Our Core Services"
*   **Badge:** "Services"

### Portfolio/Projects Section
*   **Heading:** "Showcase Gallery"
*   **Badge:** "Portfolio"
*   **Placeholder Image:** `/placeholder.jpg`

### Featured Items Section
*   **Heading:** "Featured Collections"
*   **Subheading:** "Discover our curated list of items and services."
*   **Fallback Text:** "Contact for Details", "No Image Available"

## 📂 Metadata & SEO
*   **Default Page Title:** "Smart CMS | Modern Website Solutions"
*   **Default Page Description:** "A premium multi-purpose CMS for building stunning websites and managing digital assets."
*   **Main Font:** Outfit (Google Font)
*   **External Styles:** Font Awesome 6.4.0 (loaded via CDN)

## 🛠️ Default Seed Data
Initialized in `utils/seed_data.ts` and Supabase SQL files:
*   **Initial Categories:** Creative Services, Digital Products, Specialized Solutions.
*   **Initial Projects:** Showcase Item 1, Showcase Item 2, Showcase Item 3.
