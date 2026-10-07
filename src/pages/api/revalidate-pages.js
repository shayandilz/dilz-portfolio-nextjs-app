// Called by WordPress (mu-plugins/dilz-store) when portfolio content changes.
// Store pages (App Router) are refreshed by /api/revalidate instead.
const ALLOWED_PATHS = /^\/(about|projects|articles(\/[a-z0-9-]+)?)?$/;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    if (!process.env.REVALIDATE_SECRET || req.headers["x-revalidate-secret"] !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({ message: "Invalid secret" });
    }

    const paths = Array.isArray(req.body?.paths) ? req.body.paths : [];
    const revalidated = [];
    for (const path of paths.filter((p) => ALLOWED_PATHS.test(p))) {
        try {
            await res.revalidate(path);
            revalidated.push(path);
        } catch (error) {
            console.error(`Revalidating ${path} failed:`, error.message);
        }
    }
    return res.json({ revalidated });
}
