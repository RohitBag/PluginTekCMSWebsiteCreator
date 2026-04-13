import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SiteConfig } from '@/types/cms';
import { generateHTML } from './generator';

export async function exportToZip(config: SiteConfig) {
  const zip = new JSZip();
  const assetsFolder = zip.folder("assets");
  
  // Clone config to modify paths without affecting the app state
  const exportedConfig = JSON.parse(JSON.stringify(config));
  
  // Helper to extract base64 images and replace them with paths
  const processImage = async (base64Url: string, name: string) => {
    if (!base64Url || !base64Url.startsWith('data:')) return base64Url;
    
    try {
      const response = await fetch(base64Url);
      const blob = await response.blob();
      const ext = blob.type.split('/')[1] || 'png';
      const filename = `${name}.${ext}`;
      assetsFolder?.file(filename, blob);
      return `assets/${filename}`;
    } catch (e) {
      console.error("Failed to process image", name, e);
      return base64Url;
    }
  };

  // 1. Process all images in config
  if (exportedConfig.logo.url_light) exportedConfig.logo.url_light = await processImage(exportedConfig.logo.url_light, 'logo_light');
  if (exportedConfig.logo.url_dark) exportedConfig.logo.url_dark = await processImage(exportedConfig.logo.url_dark, 'logo_dark');
  if (exportedConfig.sections.hero.bg_image_url) exportedConfig.sections.hero.bg_image_url = await processImage(exportedConfig.sections.hero.bg_image_url, 'hero_bg');
  if (exportedConfig.sections.hero.cutout_image_url) exportedConfig.sections.hero.cutout_image_url = await processImage(exportedConfig.sections.hero.cutout_image_url, 'hero_cutout');
  if (exportedConfig.sections.about.image_url) exportedConfig.sections.about.image_url = await processImage(exportedConfig.sections.about.image_url, 'about_img');

  for (let i = 0; i < exportedConfig.testimonials.length; i++) {
    const t = exportedConfig.testimonials[i];
    if (t.image_url) t.image_url = await processImage(t.image_url, `testimonial_${i}`);
  }

  for (let i = 0; i < exportedConfig.content.projects.length; i++) {
    const p = exportedConfig.content.projects[i];
    if (p.thumbnail_url) p.thumbnail_url = await processImage(p.thumbnail_url, `project_${i}_thumb`);
    for (let j = 0; j < p.images.length; j++) {
      p.images[j] = await processImage(p.images[j], `project_${i}_img_${j}`);
    }
  }

  for (let i = 0; i < exportedConfig.content.items.length; i++) {
    const item = exportedConfig.content.items[i];
    for (let j = 0; j < item.images.length; j++) {
      item.images[j] = await processImage(item.images[j], `item_${i}_img_${j}`);
    }
  }

  // 2. Generate the HTML for EACH page
  if (exportedConfig.pages && exportedConfig.pages.length > 0) {
    for (const page of exportedConfig.pages) {
      const html = generateHTML(exportedConfig, page.id);
      const filename = page.slug === '/' ? "index.html" : `${page.slug.replace(/^\//, '')}.html`;
      zip.file(filename, html);
    }
  } else {
    // Fallback if no pages defined
    const html = generateHTML(exportedConfig);
    zip.file("index.html", html);
  }

  // 3. Add the config JSON (preserving original base64 for re-import)
  zip.file("cms_config.json", JSON.stringify(config, null, 2));

  // 4. Generate and download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `plugintek-site-${Date.now()}.zip`);
}

export async function importFromZip(file: File): Promise<SiteConfig> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const configFile = loadedZip.file("cms_config.json");
  
  if (!configFile) {
    throw new Error("Invalid Plugintek ZIP: cms_config.json not found.");
  }

  const configContent = await configFile.async("string");
  return JSON.parse(configContent);
}
