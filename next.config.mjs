/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb', // Adjust as needed
        },
    },
};

export default nextConfig;
