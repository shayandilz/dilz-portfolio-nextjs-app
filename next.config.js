/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
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
            }
        ]
    },

}

module.exports = nextConfig
