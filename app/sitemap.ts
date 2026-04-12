import { MetadataRoute } from 'next';
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://plugintek-cms.com';

  // 1. Fetch all dynamic pages
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, updated_at');

  // 2. Fetch all items
  const { data: items } = await supabase
    .from('items')
    .select('id, updated_at')
    .eq('is_enabled', true);

  const pageEntries: MetadataRoute.Sitemap = (pages || []).map((page) => ({
    url: `${baseUrl}/p/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const itemEntries: MetadataRoute.Sitemap = (items || []).map((item) => ({
    url: `${baseUrl}/items/${item.id}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...pageEntries,
    ...itemEntries,
  ];
}
