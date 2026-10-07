import {getSitemapItems} from '@/src/lib/store/api';

export const revalidate = 3600;

const ORIGIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://shayan.website';
const STATIC_PATHS = ['/store', '/store/themes', '/store/plugins', '/store/docs', '/store/support', '/store/custom-order', '/store/about'];

// Served at /store/sitemap.xml and listed in the main /sitemap.xml index.
export default async function sitemap() {
    const items = await getSitemapItems();
    return [
        ...STATIC_PATHS.map((path) => ({url: `${ORIGIN}${path}`})),
        ...items.map((item) => ({url: `${ORIGIN}${item.path}`, lastModified: item.modified})),
    ];
}
