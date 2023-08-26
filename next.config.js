/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'shayan.website',
                port: '',
                pathname: '/**'
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/(.*)sitemap.xml',
                destination: '/api/sitemap-proxy'
            },
            {
                source: '/sitemap(.*).xml',
                destination: '/api/sitemap-proxy'
            }
        ];
    }

}

module.exports = nextConfig
