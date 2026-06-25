import { MetadataRoute } from 'next';
import toolsData from '@/data/tools.json';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://compareb2b.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Group tools by category
  const toolsByCategory: Record<string, typeof toolsData> = {};
  toolsData.forEach((tool) => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(tool);
  });

  // Calculate combinations of tools from the same category
  Object.values(toolsByCategory).forEach((categoryTools) => {
    for (let i = 0; i < categoryTools.length; i++) {
      for (let j = i + 1; j < categoryTools.length; j++) {
        const tool1 = categoryTools[i];
        const tool2 = categoryTools[j];
        
        // Add vs route (tool1 vs tool2)
        routes.push({
          url: `${BASE_URL}/vs/${tool1.slug}-vs-${tool2.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  });

  return routes;
}
