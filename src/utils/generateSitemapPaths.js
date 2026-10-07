import { frontendUrl } from "./variables";

// Next serves routes without a trailing slash; WordPress permalinks have one.
const withoutTrailingSlash = (path = "") => (path.length > 1 ? path.replace(/\/+$/, "") : path);

export default function generateSitemapPaths(array) {
    const items = array.map((item) => {
        const lastmod = item?.post_modified_date
            ? `<lastmod>${new Date(item.post_modified_date).toISOString().split("T")[0]}</lastmod>`
            : "";
        return `<url><loc>${frontendUrl + withoutTrailingSlash(item?.url)}</loc>${lastmod}</url>`;
    });
    return items.join("\n");
}
