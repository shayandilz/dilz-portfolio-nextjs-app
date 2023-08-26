// pages/api/generate-sitemap.js
import axios from 'axios';
import { parseString } from 'xml2js';
import xmlbuilder from 'xmlbuilder';

export default async (req, res) => {
    try {
        const sitemapIndexResponse = await axios.get('https://shayan.website/sitemap_index.xml');
        const sitemapIndexXml = sitemapIndexResponse.data;

        // Parse sitemap index XML
        parseString(sitemapIndexXml, (err, result) => {
            if (err) {
                throw err;
            }

            const sitemapUrls = result.sitemapindex.sitemap.map((entry) => entry.loc[0]);

            // Fetch data from each sitemap URL and generate new XML content
            const xmlContent = generateNewXmlContent(sitemapUrls);

            res.setHeader('Content-Type', 'text/xml');
            res.send(xmlContent);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating new sitemap XML.');
    }
};

function generateNewXmlContent(urls) {
    const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    // Fetch data from URLs and generate XML entries
    // Here, you would fetch each URL, extract necessary data, and add to the XML

    return root.end({ pretty: true });
}
