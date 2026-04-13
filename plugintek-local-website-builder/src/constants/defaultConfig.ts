import { SiteConfig } from "@/types/cms";

export const DEFAULT_CONFIG: SiteConfig = {
  metadata: {
    siteName: "My Plugintek Site",
    primaryColor: "#f59e0b",
    secondaryColor: "#71717a",
    favicon_type: "icon",
    favicon_icon: "fa-solid fa-star",
    navigation: [
      { id: "1", label: "Home", url: "#hero" },
      { id: "2", label: "About", url: "#about" },
      { id: "3", label: "Services", url: "#services" },
      { id: "4", label: "Contact", url: "#contact" },
    ],
    footer_tagline: "Building excellence with every single pixel.",
    footer_bg_color: "#0f172a",
    compliance_info: [
      { label: "Reg No", value: "PLG-2026-001" },
      { label: "Tax ID", value: "TX-998877" }
    ],
  },
  logo: {
    type: "text",
    text: "Plugintek",
    font: "Outfit",
    size: "24",
    weight: "700",
    color_light: "#000000",
    color_dark: "#ffffff",
  },
  pages: [
    {
      id: "home",
      title: "Home",
      slug: "/",
      layout: [
        { id: "hero", type: "fixed", label: "Hero Section", enabled: true },
        { id: "about", type: "component", label: "About Section", enabled: true },
        { id: "items", type: "component", label: "Featured Items", enabled: true },
        { id: "services", type: "component", label: "Services", enabled: true },
        { id: "portfolio", type: "component", label: "Portfolio", enabled: true },
        { id: "testimonials", type: "component", label: "Testimonials", enabled: true },
        { id: "contact", type: "component", label: "Contact Section", enabled: true },
      ],
    }
  ],
  testimonials: [
    {
      id: "1",
      name: "John Smith",
      role: "CEO, TechFlow",
      content: "The quality of work delivered was exceptional. They completely transformed our digital presence.",
      rating: 5,
      is_enabled: true
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Founder, Bloom",
      content: "A highly professional team that understands business needs. Highly recommended!",
      rating: 5,
      is_enabled: true
    }
  ],
  sections: {
    hero: {
      title: "Transform your brand with modern digital solutions",
      subtitle: "We create high-performance websites and digital experiences tailored to your business needs.",
      bg_type: "gradient",
      bg_color_start: "#0f172a",
      bg_color_end: "#1e1b4b",
      text_align: "center",
      text_color_mode: "auto",
      text_color: "#ffffff",
      cta_primary: "Get Started",
      cta_primary_link: "#contact",
      cta_secondary: "Our Work",
      cta_secondary_link: "#portfolio",
      badge_text: "LEADING DIGITAL AGENCY",
      badge_color: "#f59e0b",
      highlight_text: "modern digital solutions",
      highlight_color: "#f59e0b",
      overlay_card: {
        show: true,
        icon: "fa-solid fa-award",
        title: "CERTIFIED PARTNER",
        text: "Official Platinum Partner for enterprise solutions.",
        position: "bottom-right"
      }
    },
    about: {
      sublabel: "ABOUT US",
      title: "Passionate about excellence",
      desc: "Our team has over 10 years of experience in the industry, delivering top-notch solutions to clients worldwide.",
    },
    contact: {
      header: "Get in Touch",
      sublabel: "CONTACT",
      phones: ["+1 (555) 000-0000"],
      emails: ["hello@example.com"],
      social_links: [
        { platform: "facebook", url: "https://facebook.com" },
        { platform: "twitter", url: "https://twitter.com" },
        { platform: "instagram", url: "https://instagram.com" },
      ],
      address: "123 Business Ave, Suite 100\nDesign City, DC 12345",
      card_phone_title: "Direct Support",
      card_email_title: "Online Inquiry",
      card_visit_title: "Our Studio",
      clinic_label: "Headquarters",
      clinic_note: "Appointments are required for weekend visits.",
      fee_label: "Consultation Fee",
      consultation_fee: "$ 120.00",
    },
    services: { header: "Our Services", sublabel: "SERVICES" },
    projects: { header: "Recent Projects", sublabel: "PORTFOLIO" },
    items: { header: "Featured Items", sublabel: "COLLECTIONS" },
    testimonials: { header: "Client Stories", sublabel: "REVIEWS" },
  },
  content: {
    services: [],
    projects: [],
    items: [],
    custom: [],
  },
};
