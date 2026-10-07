import 'server-only';

const API = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/dilz-store/v1`;
const IS_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

// Pages are refreshed on demand by WordPress (POST /api/revalidate); this is only a fallback.
export const STORE_REVALIDATE = 3600;

class NotFound extends Error {}

/**
 * Fetch from the dilz-store REST API with cache tags.
 *
 * During `next build` a failing request falls back to `fallback` so the image can still be built
 * (e.g. before the WordPress plugin is deployed). At runtime errors are thrown, so ISR keeps
 * serving the last good page instead of caching an empty one.
 */
async function wp(path, {tags, fallback}) {
    try {
        const response = await fetch(`${API}${path}`, {
            next: {tags, revalidate: STORE_REVALIDATE},
        });
        if (response.status === 404) {
            const body = await response.json().catch(() => ({}));
            // rest_no_route: the store plugin is not active on this WordPress (yet)
            if (body?.code === 'rest_no_route') {
                return fallback;
            }
            throw new NotFound(path);
        }
        if (!response.ok) {
            throw new Error(`WordPress responded ${response.status} for ${path}`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof NotFound) {
            return null;
        }
        if (IS_BUILD) {
            console.error(`[store] ${error.message}; using fallback during build`);
            return fallback;
        }
        throw error;
    }
}

export const getSettings = () => wp('/settings', {tags: ['store-settings'], fallback: {}});

export const getProducts = ({type, featured} = {}) => {
    const query = new URLSearchParams();
    if (type) query.set('type', type);
    if (featured) query.set('featured', 'true');
    const qs = query.toString();
    return wp(`/products${qs ? `?${qs}` : ''}`, {tags: ['store-products'], fallback: []});
};

export const getProduct = (slug) =>
    wp(`/products/${encodeURIComponent(slug)}`, {tags: ['store-products', `store-product-${slug}`], fallback: null});

export const getCategories = () => wp('/categories', {tags: ['store-products'], fallback: []});

export const getDocsIndex = () => wp('/docs', {tags: ['store-docs'], fallback: []});

export const getDoc = (product, slug) =>
    wp(`/docs/${encodeURIComponent(product)}/${encodeURIComponent(slug)}`, {
        tags: ['store-docs', `store-doc-${slug}`],
        fallback: null,
    });

export const getSitemapItems = () => wp('/sitemap', {tags: ['store-products', 'store-docs'], fallback: []});
