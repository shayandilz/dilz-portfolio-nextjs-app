import {timingSafeEqual} from 'node:crypto';
import {revalidateTag} from 'next/cache';

// Called by WordPress (mu-plugins/dilz-store/revalidate.php) when store content changes.
// Portfolio pages (Pages Router) are refreshed by /api/revalidate-pages instead.

const TAG = /^store-[a-z0-9-]+$/;

function validSecret(received) {
    const expected = process.env.REVALIDATE_SECRET;
    if (!expected || !received) return false;
    const a = Buffer.from(received);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
    if (!validSecret(request.headers.get('x-revalidate-secret'))) {
        return Response.json({message: 'Invalid secret'}, {status: 401});
    }

    const body = await request.json().catch(() => ({}));
    const tags = (Array.isArray(body.tags) ? body.tags : []).filter((tag) => TAG.test(tag));
    // Webhook from an external system: expire immediately rather than stale-while-revalidate
    tags.forEach((tag) => revalidateTag(tag, {expire: 0}));

    return Response.json({revalidated: tags});
}
