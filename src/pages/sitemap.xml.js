import getSitemapPages from "../utils/getSitemapPages";
import getTotalCounts from "@/lib/getTotalCounts";
import { frontendUrl } from "@/src/utils/variables";

export default function SitemapIndexPage() {
    return null;
}
export async function getServerSideProps({ res }) {
    // Keep serving the static sitemaps even if WordPress is unreachable
    const details = await getTotalCounts().catch((error) => {
        console.error("Error fetching sitemap counts:", error.message);
        return [];
    });

    const sitemapIndex = `<?xml version='1.0' encoding='UTF-8'?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${details.map((item) => getSitemapPages(item)).join("\n")}
<sitemap><loc>${frontendUrl}/sitemapnextjs.xml</loc></sitemap>
<sitemap><loc>${frontendUrl}/store/sitemap.xml</loc></sitemap>
</sitemapindex>`;
    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=600"
    );
    res.write(sitemapIndex);
    res.end();
    return { props: {} };
}
