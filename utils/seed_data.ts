export const seedData = {
    site_settings: [
        // Branding & Global
        { key: 'site_name', value: 'Professional Services Platform', label: 'Site Name', type: 'text' },
        { key: 'site_logo_url', value: '/website_logo.png', label: 'Site Logo URL', type: 'text' },
        { key: 'site_logo_inverted_url', value: '/website_logo.png', label: 'Inverted Logo URL', type: 'text' },
        { key: 'copyright_text', value: 'Your Organization. All rights reserved.', label: 'Copyright Text', type: 'text' },
        { key: 'header_bg_color', value: '#ffffff', label: 'Header Background Color', type: 'text' },
        { key: 'footer_bg_color', value: '#18181b', label: 'Footer Background Color', type: 'text' },
        { key: 'font_family', value: 'Outfit', label: 'Site Font Family', type: 'text' },
        { key: 'site_spacing', value: 'spaced-out', label: 'Site Spacing', type: 'text' },
        { key: 'chatbot_code', value: '', label: 'Chatbot Embed Code', type: 'textarea' },
        { key: 'hero_bg_image_url', value: '/placeholder.jpg', label: 'Hero Background Image', type: 'text' },
        { key: 'about_image_url', value: '/placeholder.jpg', label: 'About Section Image', type: 'text' },

        // Compliance & Tax (Footer)
        {
            key: 'compliance_info', value: [
                { label: 'License', value: 'Certified Professional' },
                { label: 'Accreditation', value: 'Industry Standard' }
            ], label: 'Compliance Info', type: 'json'
        },

        // Navigation Labels
        { key: 'nav_home_label', value: 'Home', label: 'Nav: Home', type: 'text' },
        { key: 'nav_featured_label', value: 'Featured', label: 'Nav: Featured', type: 'text' },
        { key: 'nav_services_label', value: 'Services', label: 'Nav: Services', type: 'text' },
        { key: 'nav_portfolio_label', value: 'Portfolio', label: 'Nav: Portfolio', type: 'text' },
        { key: 'nav_contact_label', value: 'Contact', label: 'Nav: Contact', type: 'text' },

        // Hero Section Labels
        { key: 'hero_title', value: 'Elevate Your Business with Modern Solutions', label: 'Hero Title', type: 'text' },
        { key: 'hero_subtitle', value: 'Your trusted partner for specialized consulting, technical expertise, and operational excellence. We provide personalized solutions to help you achieve your goals.', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'hero_highlight_text', value: 'modern solutions', label: 'Hero Highlight Text', type: 'text' },
        { key: 'hero_cta_primary', value: 'Get Started Today', label: 'Hero CTA: Primary', type: 'text' },
        { key: 'hero_cta_secondary', value: 'Explore Our Work', label: 'Hero CTA: Secondary', type: 'text' },

        // Section Headers
        { key: 'services_header', value: 'Comprehensive Professional Services', label: 'Services Header', type: 'text' },
        { key: 'services_sublabel', value: 'Our Expertise', label: 'Services Sub-label', type: 'text' },
        { key: 'portfolio_header', value: 'Project Showcase Gallery', label: 'Portfolio Header', type: 'text' },
        { key: 'portfolio_sublabel', value: 'Recent Work', label: 'Portfolio Sub-label', type: 'text' },
        { key: 'contact_header', value: 'Take the First Step Toward Success Today', label: 'Contact Header', type: 'text' },
        { key: 'contact_sublabel', value: 'Get in Touch', label: 'Contact Sub-label', type: 'text' },
        { key: 'contact_card_phone_title', value: 'Call Us', label: 'Contact: Phone Card Title', type: 'text' },
        { key: 'contact_card_email_title', value: 'Email & Booking', label: 'Contact: Email Card Title', type: 'text' },
        { key: 'contact_card_visit_title', value: 'Visit Us', label: 'Contact: Visit Card Title', type: 'text' },
        { key: 'contact_clinic_label', value: 'Office Address:', label: 'Contact: Business Label', type: 'text' },
        { key: 'contact_clinic_note', value: '*Conveniently located in the city center', label: 'Contact: Business Note', type: 'text' },
        { key: 'contact_fee_label', value: 'Service Fee:', label: 'Contact: Fee Label', type: 'text' },

        // Contact Info
        { key: 'contact_phones', value: ['+1 555-010-888 (Support)', '+1 555-010-999 (Sales)'], label: 'Phone Numbers', type: 'json' },
        { key: 'contact_emails', value: ['info@yourorganization.com'], label: 'Email Addresses', type: 'json' },
        { key: 'contact_address', value: 'Your Organization, 123 Business Blvd, Suite 400, Central District, 10001', label: 'Address', type: 'text' },
        { key: 'contact_map_url', value: 'https://www.google.com/maps/search/?api=1&query=Your+Organization', label: 'Google Maps URL', type: 'text' },
        { key: 'consultation_fee', value: '$ 150.00 (Standard Session)', label: 'Service Fee', type: 'text' },
        {
            key: 'social_links', value: [
                { platform: 'Facebook', url: 'https://facebook.com' },
                { platform: 'Instagram', url: 'https://instagram.com' },
                { platform: 'YouTube', url: 'https://youtube.com' }
            ], label: 'Social Links', type: 'json'
        },
        { key: 'footer_tagline', value: 'Excellence in Professional Consulting', label: 'Footer Tagline', type: 'text' },

        // About Content
        { key: 'about_title', value: 'About Our Senior Partners', label: 'About Title', type: 'text' },
        { key: 'about_desc', value: 'Our team consists of highly trained professionals with over 15 years of industry experience. Dedicated to providing world-class solutions, we specialize in helping businesses navigate complex challenges with ease.', label: 'About Description', type: 'textarea' },
        { key: 'profile_title', value: 'Expertise & Training', label: 'Profile Title', type: 'text' },
        { key: 'profile_desc', value: 'Certified specialists with extensive international training. Focus areas include operational strategy and digital transformation. Committed to using evidence-based practices to improve your outcomes.', label: 'Profile Description', type: 'textarea' }
    ],
    services: [
        { title: 'Strategic Planning', description: 'Specialized consulting to define your business goals and develop actionable roadmaps for growth.', icon: 'fas fa-chess-knight', display_order: 1 },
        { title: 'Digital Transformation', description: 'Comprehensive support for modernizing your technical infrastructure and internal workflows.', icon: 'fas fa-rocket', display_order: 2 },
        { title: 'Operational Excellence', description: 'Targeted strategies to optimize your business processes and improve overall efficiency.', icon: 'fas fa-gears', display_order: 3 },
        { title: 'Specialized Advisory', description: 'Expert management for complex, hard-to-solve problems across various industry sectors.', icon: 'fas fa-lightbulb', display_order: 4 },
        { title: 'Resource Management', description: 'Holistic plans for managing your capital, human resources, and intellectual property.', icon: 'fas fa-layer-group', display_order: 5 },
        { title: 'Crisis Support', description: 'Responsive and reliable intervention for critical business emergencies and systemic issues.', icon: 'fas fa-shield-halved', display_order: 6 }
    ],
    projects: [
        {
            title: "Corporate Identity Overhaul",
            location: "Marketing Library",
            thumbnail_url: "/placeholder.jpg",
            images: []
        },
        {
            title: "Enterprise Software Integration",
            location: "Tech Library",
            thumbnail_url: "/placeholder.jpg",
            images: []
        },
        {
            title: "Supply Chain Optimization",
            location: "Operations Library",
            thumbnail_url: "/placeholder.jpg",
            images: []
        }
    ],
    custom_sections: [
        {
            title: 'Our Methodology: Precision & Results',
            content: 'Business challenges can severely affect your bottom line. We focus on personalized, actionable strategies that target the root cause. \n\nWe prioritize: \n- Accurate diagnosis through detailed organizational analysis. \n- High-quality data reviews and market research. \n- Precision interventions with measurable impacts. \n- Reclaiming productivity without unnecessary complexity.',
            display_order: 1
        },
        {
            title: 'Expert Crisis Management & Resilience',
            content: 'Exceptional support when it matters most. Our expert team provides reliable guidance across: \n\n- Operational & Financial Stability. \n- Risk Mitigation & Business Continuity planning. \n- Systemic Infrastructure Support. \n- Community leadership and professional education.',
            display_order: 2
        },
        {
            title: 'Why Choose Our Specialist Team?',
            content: 'Multidisciplinary Expertise: Top-tier strategic insight combined with deep technical proficiency. \n\nWorld-Class Infrastructure: Utilizing state-of-the-art diagnostic and management tools for optimal results. \n\nPersonalized & Compassionate: Custom plans integrating procedures, workflows, and holistic consulting with full transparency.',
            display_order: 3
        }
    ]
};
