// Create app/sitemap.ts
import { MetadataRoute } from 'next';
import roomData from '@/components/data/roomNumbers.json';
import { privateRoomIds } from '@/utils/roomUtils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.clipsyncc.me';
  const { roomIds } = roomData;

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Add room pages
  const roomPages = roomIds.map((room) => ({
    url: `${baseUrl}/${room}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...roomPages];
}
