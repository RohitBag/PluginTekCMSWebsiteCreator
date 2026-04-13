import { SiteConfig, SectionToggle, HeroConfig, AboutConfig, ContactConfig, CustomSection, ServiceItem, ProjectItem, FeatureItem } from '@/types/cms';

export function generateHTML(config: SiteConfig, pageId: string = 'home', mode: 'light' | 'dark' = 'light'): string {
  const { metadata, logo, sections, content, pages, testimonials } = config;
  
  const page = pages.find(p => p.id === pageId) || pages[0];
  const layout = page.layout;

  const head = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | ${metadata.siteName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: ${metadata.primaryColor};
            --secondary: ${metadata.secondaryColor};
            --font-sans: 'Inter', sans-serif;
            --font-display: 'Outfit', sans-serif;
            --font-serif: 'Playfair Display', serif;
            --background: #ffffff;
            --foreground: #0f172a;
            --card-bg: #ffffff;
            --nav-bg: rgba(255,255,255,0.8);
            --border: #f1f5f9;
        }
        
        ${mode === 'dark' ? `
        :root {
            --background: #020617;
            --foreground: #f8fafc;
            --card-bg: #0f172a;
            --nav-bg: rgba(2, 6, 23, 0.8);
            --border: #1e293b;
        }
        ` : ''}
        
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        body { 
            margin: 0; 
            font-family: var(--font-sans); 
            background: var(--background); 
            color: var(--foreground);
            line-height: 1.5;
            transition: background 0.3s ease, color 0.3s ease;
        }
        
        h1, h2, h3, h4, .font-display { font-family: var(--font-display); }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 1.5rem; 
        }
        
        section { padding: 4rem 0; position: relative; overflow: hidden; }
        
        @media (max-width: 768px) {
            section { padding: 3rem 0; }
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            white-space: nowrap;
        }
        
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
        
        .btn-secondary { background: var(--secondary); color: white; }
        .btn-secondary:hover { opacity: 0.9; transform: translateY(-2px); }

        .text-center { text-align: center; }
        .grid { display: grid; gap: 2rem; }
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        
        @media (max-width: 1024px) {
            .grid-3 { grid-template-columns: repeat(2, 1fr); }
        }
        
        @media (max-width: 640px) {
            .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }

        /* Nav Styles */
        nav {
            padding: 1rem 0;
            position: sticky;
            top: 0;
            background: var(--nav-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid var(--border);
            transition: all 0.3s ease;
        }
        
        .nav-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--foreground); text-decoration: none; }
        
        .nav-links-desktop { display: flex; gap: 2rem; font-weight: 600; font-size: 0.875rem; }
        
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: var(--foreground);
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1001;
            padding: 0.5rem;
        }

        .nav-mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--background);
            z-index: 999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2.5rem;
            padding: 4rem 2rem;
            transform: translateY(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0;
            visibility: hidden;
        }

        .nav-mobile-overlay.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .nav-mobile-links {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;
        }

        .nav-mobile-links a {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--foreground);
            text-decoration: none;
            transition: color 0.3s;
        }

        .nav-mobile-links a:hover { color: var(--primary); }
        
        @media (max-width: 1024px) {
            .nav-links-desktop { display: none; }
            .mobile-menu-btn { display: block; }
        }

        /* Hero Section Expansion */
        .hero { 
            min-height: 80vh; 
            display: flex; 
            align-items: center; 
            color: white; 
            padding: 4rem 0;
        }
        
        .hero-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }
        .hero-badge { 
            display: inline-block; 
            padding: 0.5rem 1.25rem; 
            border-radius: 9999px; 
            font-size: 0.75rem; 
            font-weight: 800; 
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(128,128,128,0.2);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .hero-flex {
            display: flex;
            align-items: center;
            gap: 4rem;
        }

        @media (max-width: 1024px) {
            .hero-flex { flex-direction: column; text-align: center; gap: 2rem; }
            .hero-flex.reverse { flex-direction: column; }
        }

        .hero-text { flex: 1; }
        .hero-visual { flex: 1; display: flex; justify-content: center; position: relative; }
        
        .hero h1 { font-size: clamp(2.5rem, 8vw, 4rem); margin-bottom: 1.5rem; line-height: 1.1; font-weight: 800; }
        .hero p { font-size: clamp(1rem, 4vw, 1.25rem); opacity: 0.9; margin-bottom: 2.5rem; }

        .hero-card-pulse {
            animation: expand-contract 20s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }

        @keyframes expand-contract {
            0%, 100% { transform: scale(0); opacity: 0; }
            5%, 45% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0); opacity: 0; }
        }

        .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        [data-mode="dark"] .glass {
            background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hover-lift { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        
        .text-gradient {
            background: linear-gradient(135deg, var(--foreground) 0%, #64748b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: block;
        }

        [data-mode="dark"] .text-gradient {
            background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: block;
        }

        /* Responsive Grid Wrapper */
        .stack-tablet { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem; align-items: center; }
        @media (max-width: 1024px) {
            .stack-tablet { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
            .stack-tablet div:first-child { order: 2; }
            .stack-tablet div:last-child { order: 1; }
        }

        /* Cards */
        .card {
            background: var(--card-bg);
            border-radius: 1.5rem;
            border: 1px solid var(--border);
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
            transition: transform 0.3s;
        }
        .card:hover { transform: translateY(-10px); }

        /* Animations */
        .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Footer */
        footer { background: ${mode === 'dark' ? '#000000' : '#0f172a'}; color: white; padding: 4rem 0; text-align: center; }
        .footer-logo { font-size: 2rem; margin-bottom: 1rem; }
        .social-links { display: flex; justify-content: center; gap: 1.5rem; margin-top: 2rem; }
        .social-links a { color: white; font-size: 1.5rem; transition: color-0.3s; }
        .social-links a:hover { color: var(--primary); }

        ${content.custom.map(s => `
            ${s.css || ''}
            @media (max-width: 768px) {
                ${s.is_mobile_custom ? s.mobile_css || '' : ''}
            }
        `).join('\n')}
    </style>
</head>
`;

  const nav = `
<nav>
    <div class="container nav-content">
        <a href="index.html" class="logo" style="${logo.type === 'text' ? `font-family: '${logo.font || 'Outfit'}', sans-serif; font-size: ${logo.size || '24'}px; font-weight: ${logo.weight || '800'}; color: ${mode === 'dark' ? logo.color_dark : logo.color_light};` : ''}">
            ${logo.type === 'text' ? logo.text : `<img src="${mode === 'dark' ? logo.url_dark : logo.url_light}" style="height: 40px;" />`}
        </a>
        <div class="nav-links-desktop">
            ${(metadata.navigation || []).map(link => `<a href="${link.url.startsWith('#') ? link.url : link.url + '.html'}" style="text-decoration: none; color: inherit;">${link.label}</a>`).join('')}
        </div>
        <button class="mobile-menu-btn" onclick="toggleMenu()" aria-label="Toggle Menu">
            <i class="fa-solid fa-bars"></i>
        </button>
    </div>
</nav>

<div class="nav-mobile-overlay" id="mobileMenu">
    <div style="position: absolute; top: 1.5rem; right: 1.5rem;">
        <button class="mobile-menu-btn" onclick="toggleMenu()" style="display: block;">
            <i class="fa-solid fa-times"></i>
        </button>
    </div>
    <ul class="nav-mobile-links">
        ${(metadata.navigation || []).map(link => `<li><a href="${link.url.startsWith('#') ? link.url : link.url + '.html'}" onclick="toggleMenu()">${link.label}</a></li>`).join('')}
    </ul>
</div>
`;

  const sectionsHTML = layout.filter(s => s.enabled).map(section => {
    switch (section.id) {
      case 'hero': return generateHeroHTML(page.hero_override || sections.hero);
      case 'about': return generateAboutHTML(sections.about);
      case 'services': return generateServicesHTML(sections.services, content.services);
      case 'portfolio': return generatePortfolioHTML(sections.projects, content.projects);
      case 'items': return generateItemsHTML(sections.items, content.items);
      case 'testimonials': return generateTestimonialsHTML(sections.testimonials, testimonials);
      case 'contact': return generateContactHTML(sections.contact);
      default: 
        if (section.id.startsWith('custom_section_')) {
            const custom = content.custom.find(c => c.id === section.id.replace('custom_section_', ''));
            if (!custom) return '';
            return `
                <section id="${section.id}">
                    <div class="desktop-content">${custom.content}</div>
                    ${custom.is_mobile_custom ? `<div class="mobile-content">${custom.mobile_content}</div>` : ''}
                </section>
                <style>
                    ${custom.is_mobile_custom ? `
                        @media (max-width: 768px) {
                            #${section.id} .desktop-content { display: none; }
                            #${section.id} .mobile-content { display: block; }
                        }
                        @media (min-width: 769px) {
                            #${section.id} .mobile-content { display: none; }
                        }
                    ` : ''}
                </style>
            `;
        }
        return '';
    }
  }).join('');

  const footer = `
<footer style="background: ${metadata.footer_bg_color || (mode === 'dark' ? '#0f172a' : '#0f172a')}; color: white; padding: 6rem 0 4rem 0; border-top: 1px solid rgba(255,255,255,0.1); text-align: left;">
    <div class="container">
        <div style="display: flex; flex-wrap: wrap; gap: 4rem; margin-bottom: 4rem; justify-content: space-between;">
            <!-- Column 1: Info -->
            <div style="flex: 1; min-width: 280px;">
                <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: white; text-align: left;">${logo.type === 'text' ? logo.text : metadata.siteName}</h2>
                <p style="opacity: 0.7; font-size: 0.9375rem; line-height: 1.6; margin-bottom: 2rem; max-width: 300px; text-align: left;">${metadata.footer_tagline || 'Building excellence with every single pixel.'}</p>
                ${metadata.compliance_info && metadata.compliance_info.length > 0 ? `
                    <div style="font-size: 0.75rem; opacity: 0.5; display: flex; flex-direction: column; gap: 0.5rem; text-align: left;">
                        ${metadata.compliance_info.map(info => `<div style="text-align: left;">${info.label}: ${info.value}</div>`).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- Column 2: Links -->
            <div style="flex: 1; min-width: 200px;">
                <h4 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 2rem; color: white; text-align: left;">Quick Links</h4>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; text-align: left;">
                    <li><a href="#hero" style="color: white; opacity: 0.7; text-decoration: none; font-size: 0.9375rem; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Home</a></li>
                    <li><a href="#about" style="color: white; opacity: 0.7; text-decoration: none; font-size: 0.9375rem; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">About</a></li>
                    <li><a href="#services" style="color: white; opacity: 0.7; text-decoration: none; font-size: 0.9375rem; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Services</a></li>
                    <li><a href="#contact" style="color: white; opacity: 0.7; text-decoration: none; font-size: 0.9375rem; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Contact</a></li>
                </ul>
            </div>

            <!-- Column 3: Social -->
            <div style="flex: 1; min-width: 200px;">
                <h4 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 2rem; color: white; text-align: left;">Connect</h4>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                    ${sections.contact.social_links.map(s => `
                        <a href="${s.url}" style="width: 2.75rem; height: 2.75rem; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-size: 1.125rem; transition: all 0.3s;" onmouseover="this.style.background='var(--primary)'; this.style.transform='translateY(-3px)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'">
                            <i class="fa-brands fa-${s.platform.toLowerCase()}"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>

        <div style="padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; opacity: 0.5; font-size: 0.8125rem;">
            &copy; ${new Date().getFullYear()} ${metadata.siteName}. All rights reserved.
        </div>
    </div>
</footer>
<style>
    @media (max-width: 768px) {
        footer > .container > div:first-child { grid-template-columns: 1fr !important; gap: 3rem !important; }
    }
</style>
`;

  return `
<!DOCTYPE html>
<html lang="en" data-mode="${mode}">
${head}
<body>
    ${nav}
    ${sectionsHTML}
    ${footer}
    <script>
        // Mobile Menu Toggle
        function toggleMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Entrance Animations
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('fade-up');
            observer.observe(section);
        });
    </script>
</body>
</html>
`;
}

function generateHeroHTML(hero: HeroConfig): string {
  if (!hero) return '';
  
  const heightMap: Record<string, string> = {
    full: '100vh',
    large: '80vh',
    medium: '60vh',
  };

  const hMobile = heightMap[hero.height_mobile || 'large'] || '80vh';
  const hDesktop = heightMap[hero.height_desktop || 'large'] || '80vh';

  let bgStyles = `min-height: ${hMobile};`;
  if (hero.bg_type === 'image') {
    bgStyles += `background-image: url(${hero.bg_image_url}); background-size: cover; background-position: center;`;
    if (hero.bg_image_scroll) {
      bgStyles += `background-attachment: fixed;`;
    }
  } else if (hero.bg_type === 'gradient') {
    bgStyles += `background: linear-gradient(135deg, ${hero.bg_color_start}, ${hero.bg_color_end});`;
  } else if (hero.bg_type === 'solid') {
    bgStyles += `background: ${hero.bg_color_start};`;
  }

  const overlay = (hero.bg_type === 'image' || hero.bg_type === 'video') ? 
    `<div style="position: absolute; inset: 0; background: linear-gradient(${hero.overlay_gradient_angle || 180}deg, ${hero.overlay_color_start || '#000000'}, ${hero.overlay_color_end || '#000000'}); opacity: ${(hero.overlay_opacity_start || 60) / 100}; z-index: 1;"></div>` : '';

  const textColor = hero.text_color_mode === 'custom' ? hero.text_color : 'white';

  let titleHtml = hero.title;
  if (hero.highlight_text) {
    const span = `<span style="color: ${hero.highlight_color || 'var(--primary)'}; font-weight: 800; ${hero.highlight_italic ? 'font-style: italic;' : ''} ${hero.highlight_font ? `font-family: ${hero.highlight_font};` : ''}">${hero.highlight_text}</span>`;
    titleHtml = titleHtml.replace(hero.highlight_text, span);
  }

  const titleSizeMap: Record<string, string> = {
    small: 'clamp(1.5rem, 4vw, 2.5rem)',
    base: 'clamp(2.5rem, 8vw, 4rem)',
    large: 'clamp(3rem, 10vw, 5rem)',
    xl: 'clamp(3.5rem, 12vw, 6rem)',
  };
  const titleSize = titleSizeMap[hero.title_size || 'base'];

  const contentAlign = hero.text_align || 'center';
  const flexAlign = contentAlign === 'left' ? 'flex-start' : contentAlign === 'right' ? 'flex-end' : 'center';

  return `
<section id="hero" class="hero" style="${bgStyles} --h-desktop: ${hDesktop}; color: ${textColor}; display: flex; align-items: center; justify-content: center;">
    ${hero.bg_type === 'video' && hero.bg_video_url ? `
        <video autoPlay loop muted playsInline style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
            <source src="${hero.bg_video_url}" type="video/mp4">
        </video>
    ` : ''}
    ${overlay}
    <div class="container" style="position: relative; z-index: 2; width: 100%;">
        <div class="hero-flex ${hero.cutout_position === 'left' ? 'reverse' : ''}">
            <div class="hero-text">
                ${hero.badge_text ? `<span class="hero-badge" style="background: rgba(128,128,128,0.1); color: ${hero.badge_color || 'var(--primary)'}; border-color: ${hero.badge_color || 'var(--primary)'}40; padding: 0.5rem 1rem; border-radius: 999px; margin-bottom: 1rem; display: inline-block;">${hero.badge_text}</span>` : ''}
                <h1 style="font-size: ${titleSize}; margin-bottom: 1.5rem; line-height: 1.1;">${titleHtml}</h1>
                <p style="opacity: 0.9; margin-bottom: 2.5rem; max-width: 600px; ${contentAlign === 'center' ? 'margin-left: auto; margin-right: auto;' : ''}">${hero.subtitle}</p>
                <div class="hero-btns" style="display: flex; gap: 1rem; ${contentAlign === 'center' ? 'justify-content: center;' : contentAlign === 'right' ? 'justify-content: flex-end' : ''}">
                    ${hero.cta_primary ? `<a href="${hero.cta_primary_link}" class="btn" style="background: ${hero.cta_primary_color || 'var(--primary)'}; color: white; padding: 1rem 2rem; border-radius: ${hero.cta_border_radius === 'none' ? '0' : hero.cta_border_radius === 'md' ? '0.5rem' : hero.cta_border_radius === 'xl' ? '1rem' : '9999px'}">${hero.cta_primary}</a>` : ''}
                    ${hero.cta_secondary ? `<a href="${hero.cta_secondary_link}" class="btn" style="background: rgba(255,255,255,0.1); color: white; padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: ${hero.cta_border_radius === 'none' ? '0' : hero.cta_border_radius === 'md' ? '0.5rem' : hero.cta_border_radius === 'xl' ? '1rem' : '9999px'}">${hero.cta_secondary}</a>` : ''}
                </div>
            </div>
            ${hero.cutout_image_url ? `
                <div class="hero-visual" style="flex: 1; position: relative; display: flex; justify-content: center;">
                    <img src="${hero.cutout_image_url}" style="max-width: 100%; max-height: 70vh; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));" />
                    ${hero.overlay_card?.show ? `
                        <div class="hero-card-pulse" style="position: absolute; ${hero.overlay_card.position.includes('left') ? 'left: -5%;' : 'right: -5%;'} ${hero.overlay_card.position.includes('top') ? 'top: 10%;' : 'bottom: 20%;'} padding: 1.25rem; border-radius: 1.25rem; width: 240px; z-index: 10;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; background: var(--primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="${hero.overlay_card.icon}"></i>
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <span style="font-size: 0.65rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em;">${hero.overlay_card.title.split(' ')[0]}</span>
                                    <span style="font-size: 0.9rem; font-weight: 800; color: var(--foreground);">${hero.overlay_card.title.split(' ').slice(1).join(' ') || 'SPECIALIST'}</span>
                                </div>
                            </div>
                            <p style="margin: 0; font-size: 0.8rem; color: var(--foreground); opacity: 0.7; line-height: 1.4; font-weight: 500;">${hero.overlay_card.text}</p>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    </div>
</section>
<style>
    @media (min-width: 1025px) {
        .hero { min-height: var(--h-desktop) !important; }
    }
</style>
`;
}

function generateTestimonialsHTML(meta: { header: string; sublabel: string }, testimonials: Testimonial[]): string {
    if (!meta) return '';
    const enabledTestimonials = testimonials.filter(t => t.is_enabled);
    if (enabledTestimonials.length === 0) return '';

    return `
<section id="testimonials" style="background: var(--background); position: relative;">
    <div style="position: absolute; top: 0; right: 0; opacity: 0.03; font-size: 20rem; pointer-events: none; transform: translate(20%, -20%);">
        <i class="fa-solid fa-quote-right"></i>
    </div>
    <div class="container" style="position: relative; z-index: 1;">
        <div class="text-center" style="margin-bottom: 4rem;">
            <span style="color: var(--primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">${meta.sublabel || ''}</span>
            <h2 class="text-gradient" style="font-size: clamp(2rem, 5vw, 2.5rem); margin-top: 1rem;">${meta.header || ''}</h2>
        </div>
        <div class="grid grid-3">
            ${enabledTestimonials.map(t => `
                <div class="card" style="padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; border: 1px solid var(--border); background: var(--card-bg);">
                    <div style="display: flex; gap: 0.5rem; color: #f59e0b; font-size: 0.875rem;">
                        ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
                    </div>
                    <p style="font-style: italic; color: var(--foreground); opacity: 0.8; font-size: 1.125rem; flex: 1; line-height: 1.6;">"${t.content}"</p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        ${t.image_url ? `<img src="${t.image_url}" style="width: 3rem; height: 3rem; border-radius: 50%; object-fit: cover;" />` : `
                            <div style="width: 3rem; height: 3rem; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                                ${t.name.charAt(0)}
                            </div>
                        `}
                        <div>
                            <h4 style="margin: 0; font-size: 1rem;">${t.name}</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--primary); font-weight: 600;">${t.role || ''}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</section>
`;
}

function generateAboutHTML(about: AboutConfig): string {
  if (!about) return '';
  return `
<section id="about">
    <div class="container stack-tablet">
        <div>
            <span style="color: var(--primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">${about.sublabel || ''}</span>
            <h2 class="text-gradient" style="font-size: clamp(2rem, 5vw, 2.5rem); margin-top: 1rem; font-weight: 800; letter-spacing: -0.02em;">${about.title}</h2>
            <p style="color: #64748b; font-size: 1.125rem; line-height: 1.7; margin-bottom: 2rem;">${about.desc}</p>
            ${about.profile_title ? `
                <div class="hover-lift" style="margin-top: 2rem; padding: 2rem; background: var(--card-bg); border-radius: 1.5rem; border: 1px solid var(--border); border-left: 6px solid var(--primary); text-align: left; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: 800; color: var(--primary);">${about.profile_title}</h4>
                    <p style="margin: 0; color: #64748b; font-size: 0.9375rem; line-height: 1.8; text-align: justify;">${about.profile_desc}</p>
                </div>
            ` : ''}
        </div>
        <div style="border-radius: 1.5rem; overflow: hidden; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
            <img src="${about.image_url || 'https://via.placeholder.com/600x800'}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
    </div>
</section>
`;
}

function generateServicesHTML(meta: { header: string; sublabel: string }, services: ServiceItem[]): string {
    if (!meta) return '';
    return `
<section id="services" style="background: var(--background); border-top: 1px solid var(--border);">
    <div class="container">
        <div class="text-center" style="margin-bottom: 4rem;">
            <span style="color: var(--primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">${meta.sublabel || ''}</span>
            <h2 class="text-gradient" style="font-size: clamp(2rem, 5vw, 2.5rem); margin-top: 1rem;">${meta.header || ''}</h2>
        </div>
        <div class="grid grid-4-desktop">
            ${services.map(s => `
                <div class="hover-lift" style="background: var(--card-bg); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); border-top: 4px solid transparent; transition: all 0.3s;" onmouseover="this.style.borderTopColor='var(--primary)'" onmouseout="this.style.borderTopColor='transparent'">
                    <div style="width: 3.5rem; height: 3.5rem; background: rgba(128,128,128,0.1); color: var(--primary); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.5rem;">
                        <i class="${s.icon}"></i>
                    </div>
                    <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">${s.title}</h3>
                    <p style="color: var(--foreground); opacity: 0.7; margin: 0; font-size: 0.9375rem; line-height: 1.6;">${s.description}</p>
                </div>
            `).join('')}
        </div>
    </div>
</section>
<style>
    .grid-4-desktop { display: grid; gap: 2rem; grid-template-columns: repeat(4, 1fr); }
    @media (max-width: 1024px) { .grid-4-desktop { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .grid-4-desktop { grid-template-columns: 1fr; } }
</style>
`;
}

function generatePortfolioHTML(meta: { header: string; sublabel: string }, projects: ProjectItem[]): string {
    if (!meta) return '';
    return `
<section id="portfolio">
    <div class="container">
        <div class="text-center" style="margin-bottom: 4rem;">
            <span style="color: var(--primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">${meta.sublabel || ''}</span>
            <h2 class="text-gradient" style="font-size: clamp(2rem, 5vw, 2.5rem); margin-top: 1rem;">${meta.header || ''}</h2>
        </div>
        <div class="grid grid-3">
            ${projects.map(p => `
                <div class="hover-lift" style="position: relative; border-radius: 2rem; overflow: hidden; aspect-ratio: 4/3; cursor: pointer; border: 1px solid var(--border);">
                    <img src="${p.thumbnail_url || (p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/600x400')}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" />
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem; color: white;">
                        <h4 style="margin: 0; font-size: 1.35rem; font-weight: 700;">${p.title}</h4>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; opacity: 0.8; font-weight: 500;"><i class="fa-solid fa-location-dot" style="margin-right: 0.5rem; color: var(--primary);"></i>${p.location}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</section>
`;
}

function generateItemsHTML(meta: { header: string; sublabel: string }, items: FeatureItem[]): string {
    if (!meta) return '';
    return `
<section id="items" style="background: var(--background); border-top: 1px solid var(--border);">
    <div class="container">
        <div class="text-center" style="margin-bottom: 4rem;">
            <span style="color: var(--primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">${meta.sublabel || ''}</span>
            <h2 class="text-gradient" style="font-size: clamp(2rem, 5vw, 2.5rem); margin-top: 1rem;">${meta.header || ''}</h2>
        </div>
        <div class="grid grid-3">
            ${items.map(item => `
                <div class="hover-lift" style="background: var(--card-bg); border-radius: 2rem; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                    <div style="aspect-ratio: 16/10; position: relative; overflow: hidden;">
                         <img src="${item.images[0] || 'https://via.placeholder.com/600x400'}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
                         <div style="position: absolute; top: 1.25rem; right: 1.25rem; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; color: var(--foreground); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='white'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='scale(1)'">
                             <i class="fa-regular fa-bookmark"></i>
                         </div>
                    </div>
                    <div style="padding: 2rem;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; gap: 1rem;">
                            <h3 style="margin: 0; font-size: 1.35rem; font-weight: 700; line-height: 1.2;">${item.title}</h3>
                        </div>
                        <p style="color: var(--foreground); opacity: 0.6; font-size: 0.9375rem; margin-bottom: 2rem; line-height: 1.6; height: 3rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${item.description}</p>
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                            <div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">
                                ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price || 0)}
                            </div>
                            <a href="${item.action_url || '#'}" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: var(--foreground); font-weight: 700; font-size: 0.875rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--foreground)'">
                                Details <i class="fa-solid fa-arrow-right" style="font-size: 0.75rem;"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</section>
`;
}

function generateContactHTML(contact: ContactConfig): string {
    if (!contact) return '';
    return `
<section id="contact" style="background: var(--background); position: relative; overflow: hidden;">
    <div class="container">
        <div class="text-center" style="margin-bottom: 4rem;">
            <span style="color: var(--primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">${contact.sublabel || ''}</span>
            <h2 class="text-gradient" style="font-size: clamp(2rem, 5vw, 2.5rem); margin-top: 1rem;">${contact.header || ''}</h2>
        </div>
        <div class="contact-grid">
            <!-- Phones -->
            <div class="hover-lift card" style="padding: 3rem 2.5rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 4rem; height: 4rem; background: rgba(128,128,128,0.06); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 2rem;">
                    <i class="fa-solid fa-phone"></i>
                </div>
                <h3 style="margin-bottom: 1.5rem; font-size: 1.35rem; font-weight: 800;">${contact.card_phone_title || 'Call Us'}</h3>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${contact.phones.map(p => `
                        <a href="tel:${p.replace(/\D/g, '')}" style="text-decoration: none; color: var(--foreground); font-weight: 700; font-size: 1.125rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--foreground)'">${p}</a>
                    `).join('')}
                </div>
            </div>

            <!-- Emails -->
            <div class="hover-lift card" style="padding: 3rem 2.5rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 4rem; height: 4rem; background: rgba(128,128,128,0.06); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 2rem;">
                    <i class="fa-solid fa-envelope"></i>
                </div>
                <h3 style="margin-bottom: 1.5rem; font-size: 1.35rem; font-weight: 800;">${contact.card_email_title || 'Email Us'}</h3>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
                    ${contact.emails.map(e => `
                        <a href="mailto:${e}" style="text-decoration: none; color: var(--foreground); font-weight: 700; font-size: 1.125rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--foreground)'">${e}</a>
                    `).join('')}
                </div>
                ${contact.consultation_fee ? `
                    <div style="background: rgba(128,128,128,0.05); padding: 1rem 1.5rem; border-radius: 1rem; width: 100%; margin-top: auto;">
                        <span style="display: block; font-size: 0.65rem; font-weight: 800; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">${contact.fee_label || 'Consultation Fee'}</span>
                        <span style="font-weight: 800; color: var(--primary); font-size: 1.125rem;">${contact.consultation_fee}</span>
                    </div>
                ` : ''}
            </div>

            <!-- Address (Wider) -->
            <div class="hover-lift card" style="padding: 3rem 2.5rem; grid-column: span 1.5/auto; text-align: left;">
                <div style="width: 4rem; height: 4rem; background: rgba(128,128,128,0.06); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 2rem;">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3 style="margin-bottom: 1.5rem; font-size: 1.35rem; font-weight: 800;">${contact.card_visit_title || 'Visit Us'}</h3>
                <div style="margin-bottom: 2rem;">
                    <span style="display: block; font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase, letter-spacing: 0.05em; margin-bottom: 0.75rem;">${contact.clinic_label || 'Office Location'}</span>
                    <p style="font-weight: 700; font-size: 1.125rem; line-height: 1.5; margin-bottom: 0.5rem; color: var(--foreground);">${contact.address.split('\n').join('<br>')}</p>
                    ${contact.clinic_note ? `<p style="font-style: italic; opacity: 0.6; font-size: 0.8125rem;">* ${contact.clinic_note}</p>` : ''}
                </div>
                <a href="${contact.map_url}" target="_blank" class="btn" style="width: 100%; background: var(--primary); color: white; padding: 1.25rem; font-size: 1rem; border-radius: 1rem;">View on Google Maps <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left: 0.5rem; font-size: 0.8rem;"></i></a>
            </div>
        </div>
    </div>
</section>
<style>
    .contact-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; }
    .contact-grid > .card { flex: 1; min-width: 320px; border: 1px solid var(--border); border-radius: 2.5rem; background: var(--card-bg); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .contact-grid > .card:last-child { flex: 1.5; }
    @media (max-width: 1024px) {
        .contact-grid > .card { flex: 1 !important; min-width: 100%; }
        .contact-grid > .card:last-child { flex: 1 !important; }
    }
</style>
`;
}
