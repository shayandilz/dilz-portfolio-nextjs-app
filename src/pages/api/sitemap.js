module.exports = async (req, res) => {
    // Fetch the sitemap from the WordPress backend
    const xmlRes = await fetch((process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || "") + req.url);
    let xml = await xmlRes.text();

    // Set the Content-Type to text/xml and send the XML content to the client
    res.setHeader("Content-Type", "text/xml");
    res.write(xml);
    res.end();
};
