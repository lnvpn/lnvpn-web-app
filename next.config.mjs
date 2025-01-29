/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'lnvpn.com' }],
                destination: 'https://lnvpn.net/:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
