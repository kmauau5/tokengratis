import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aifreetoken.com';
  let providers: any[] = [];
  
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'providers.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    providers = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load providers.json for sitemap:', error);
  }

  const routes = ['', '/en', '/id', '/en/donate', '/id/donate'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const providerRoutes = providers.flatMap((provider) => [
    {
      url: `${baseUrl}/en/provider/${provider.id}`,
      lastModified: new Date(provider.lastSyncedAt || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/id/provider/${provider.id}`,
      lastModified: new Date(provider.lastSyncedAt || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }
  ]);

  return [...routes, ...providerRoutes];
}
