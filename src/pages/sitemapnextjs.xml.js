import React from "react";
import * as fs from "fs";
const Sitemap = () => {
    return null;
};
export const getServerSideProps = async ({ res }) => {
    const BASE_URL = "https://shayan.website";

    const staticPaths = fs
        .readdirSync("src/pages")
        .filter((staticPage) => {
            return ![
                "api",
                "about",
                "_app.js",
                "_document.js",
                "404.js",
                "sitemap.xml.js",
            ].includes(staticPage);
        })
        .map((staticPagePath) => {
            return `${BASE_URL}/${staticPagePath}`;
        });

    const dynamicPaths = [`${BASE_URL}/product/1`, `${BASE_URL}/product/2`];

    const allPaths = [...staticPaths, ...dynamicPaths];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((url) => {
            return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default Sitemap;