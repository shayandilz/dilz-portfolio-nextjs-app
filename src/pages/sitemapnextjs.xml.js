import { frontendUrl } from "@/src/utils/variables";

// Static Next routes. Posts come from the WordPress sitemaps, the store from /store/sitemap.xml.
const STATIC_PATHS = ["", "/about", "/projects", "/articles"];

const Sitemap = () => null;

export const getServerSideProps = async ({ res }) => {
    const urls = STATIC_PATHS
        .map((path) => `<url><loc>${frontendUrl}${path || "/"}</loc></url>`)
        .join("\n");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
    res.write(sitemap);
    res.end();

    return { props: {} };
};

export default Sitemap;
