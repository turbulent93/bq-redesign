/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
        // API_URL: process.env.API_URL
    }
};

export default nextConfig;
