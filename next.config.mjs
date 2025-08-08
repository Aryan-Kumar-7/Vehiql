/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsHmrCache: false, // defaults to true
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fcjsdyufspnybfozrwtv.supabase.co',
            }
        ]
    }
};

export default nextConfig;
