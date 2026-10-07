export async function fetchCommonData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom/v1/next/`);
        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error("Error fetching common data:", error);
        return {};
    }
}

/**
 * Keep only the global data the layout needs (logo, favicon, menu, social, contact),
 * so pages don't serialize the whole API response into __NEXT_DATA__.
 */
export function pickSite(data) {
    const global = data?.global ?? {};
    return {
        global: {
            icon: global.icon ?? {},
            menu: global.menu ?? [],
            social: global.social ?? [],
            contact: global.contact ?? [],
        },
    };
}

// Pages are refreshed on demand by WordPress (see /api/revalidate-pages); this is only a fallback.
export const REVALIDATE_SECONDS = 3600;

export async function fetchPostData(page = 1, perPage = 10) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom-blog/v1/posts?page=${page}&per_page=${perPage}`);
        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error("Error fetching common data:", error);
        return {};
    }
}
