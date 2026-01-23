import { MetadataRoute } from 'next';
import roomData from '@/components/data/roomNumbers.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.clipsyncc.me';
  const { roomIds } = roomData;
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Add room pages with appropriate priorities
  const roomPages: MetadataRoute.Sitemap = roomIds.map((room) => ({
    url: `${baseUrl}/${room}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...roomPages];
}
