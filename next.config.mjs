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
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors https://my.albyhub.com;"
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
