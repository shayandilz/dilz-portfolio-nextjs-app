/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    experimental: {
        // Needed for a styled 404 on unmatched URLs: the app has two root layouts (see src/app/global-not-found.js)
        globalNotFound: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'shayan.website',
                port: '',
                pathname: '/**'
            }, {
                protocol: 'https',
                hostname: 'panel.shayan.website',
                port: '',
                pathname: '/**'
            },
            // Local WordPress (Local by Flywheel) for testing builds; never enabled in CI
            ...(process.env.ALLOW_LOCAL_WP_IMAGES === '1'
                ? [{protocol: 'http', hostname: 'localhost', port: '10023', pathname: '/**'}]
                : []),
        ]
    },

}

module.exports = nextConfig
