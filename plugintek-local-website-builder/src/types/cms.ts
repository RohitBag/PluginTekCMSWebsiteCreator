export interface ImageConfig {
  url: string;
  storagePath?: string;
}

export interface SiteLogo {
  type: 'image' | 'text';
  url_light?: string;
  url_dark?: string;
  text?: string;
  font?: string;
  size?: string;
  weight?: string;
  color_light?: string;
  color_dark?: string;
  brightness_light?: string;
  brightness_dark?: string;
  grayscale_light?: string;
  grayscale_dark?: string;
}

export interface SectionToggle {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  badge_text?: string;
  badge_color?: string;
  highlight_text?: string;
  highlight_color?: string;
  highlight_italic?: boolean;
  highlight_font?: string;
  cta_primary?: string;
  cta_primary_link?: string;
  cta_primary_color?: string;
  cta_secondary?: string;
  cta_secondary_link?: string;
  cta_secondary_color?: string;
  cta_border_radius?: string;
  text_align?: 'left' | 'center' | 'right';
  title_size?: 'small' | 'base' | 'large' | 'xl';
  height_mobile?: string;
  height_desktop?: string;
  text_color_mode?: 'auto' | 'custom';
  text_color?: string;
  bg_type: 'image' | 'gradient' | 'solid' | 'video';
  bg_image_url?: string;
  bg_video_url?: string;
  bg_image_scroll?: boolean;
  bg_color_start?: string;
  bg_color_end?: string;
  overlay_opacity_start?: number;
  overlay_opacity_end?: number;
  overlay_color_start?: string;
  overlay_color_end?: string;
  overlay_gradient_angle?: number;
  cutout_image_url?: string;
  cutout_position?: 'left' | 'right';
  cutout_size?: string;
  overlay_card?: {
    show: boolean;
    icon: string;
    title: string;
    text: string;
    position: string;
  };
}

export interface AboutConfig {
  sublabel?: string;
  title: string;
  desc: string;
  profile_title?: string;
  profile_desc?: string;
  image_url?: string;
}

export interface ContactConfig {
  header?: string;
  sublabel?: string;
  phones: string[];
  emails: string[];
  website_url?: string;
  social_links: { platform: string; url: string }[];
  address?: string;
  map_url?: string;
  card_phone_title?: string;
  card_email_title?: string;
  card_visit_title?: string;
  clinic_label?: string;
  clinic_note?: string;
  fee_label?: string;
  consultation_fee?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  page_url?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  location?: string;
  description?: string;
  thumbnail_url?: string;
  images: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  action_label?: string;
  action_url?: string;
  images: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  css?: string;
  is_html: boolean;
  mobile_content?: string;
  mobile_css?: string;
  is_mobile_custom?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  image_url?: string;
  rating: number;
  is_enabled: boolean;
}

export interface PageConfig {
  id: string;
  title: string;
  slug: string;
  layout: SectionToggle[];
  hero_override?: Partial<HeroConfig>;
}

export interface SiteConfig {
  metadata: {
    siteName: string;
    primaryColor: string;
    secondaryColor: string;
    favicon_url?: string;
    favicon_icon?: string;
    favicon_type?: 'image' | 'icon';
    navigation: { label: string; url: string; id: string }[];
    footer_tagline?: string;
    footer_bg_color?: string;
    compliance_info?: { label: string; value: string }[];
  };
  logo: SiteLogo;
  pages: PageConfig[];
  testimonials: Testimonial[];
  sections: {
    hero: HeroConfig;
    about: AboutConfig;
    contact: ContactConfig;
    services: { header: string; sublabel: string };
    projects: { header: string; sublabel: string };
    items: { header: string; sublabel: string };
    testimonials: { header: string; sublabel: string };
  };
  content: {
    services: ServiceItem[];
    projects: ProjectItem[];
    items: FeatureItem[];
    custom: CustomSection[];
  };
}
