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
            },{
                protocol: 'https',
                hostname: 'panelwp-lwuzspg4ry.liara.run',
                port: '',
                pathname: '/**'
            }
        ]
    },

}

module.exports = nextConfig
