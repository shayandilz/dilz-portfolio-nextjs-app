import { frontendUrl, sitemapPerPage } from "./variables";

export default function getSitemapPages(item) {
    const items = [];
    for (let i = 1; i <= Math.ceil(item.total / sitemapPerPage); i++) {
        items.push(`<sitemap><loc>${frontendUrl}/sitemap/${item.name}_sitemap${i}.xml</loc></sitemap>`);
    }
    return items.join("\n");
}
