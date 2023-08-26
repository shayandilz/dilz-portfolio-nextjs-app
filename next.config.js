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

}

module.exports = nextConfig
