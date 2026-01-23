import Script from 'next/script';

interface StructuredDataProps {
    type: 'webapp' | 'organization' | 'breadcrumb';
    data?: {
        roomId?: string;
    };
}

export function StructuredData({ type, data }: StructuredDataProps) {
    const baseUrl = 'https://www.clipsyncc.me';

    const schemas = {
        webapp: {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ClipSync',
            url: baseUrl,
            description: 'Sync your clipboard across devices effortlessly and transfer files in real-time. Secure room-based sharing for text and files.',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web Browser',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
            },
            featureList: [
                'Real-time clipboard synchronization',
                'Secure file transfer',
                'Room-based sharing',
                'Cross-device compatibility',
                'No login required',
            ],
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            softwareVersion: '1.0',
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '150',
            },
        },
        organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ClipSync',
            url: baseUrl,
            logo: `${baseUrl}/icon.png`,
            description: 'Real-time clipboard and file synchronization service',
            sameAs: [
                // Add your social media profiles here when available
                // 'https://twitter.com/clipsync',
                // 'https://github.com/clipsync',
            ],
        },
        breadcrumb: data?.roomId
            ? {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: baseUrl,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: `Room ${data.roomId}`,
                        item: `${baseUrl}/${data.roomId}`,
                    },
                ],
            }
            : null,
    };

    const schema = schemas[type];

    if (!schema) return null;

    return (
        <Script
            id={`structured-data-${type}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
