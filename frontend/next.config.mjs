/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Mark server-only packages so Next.js doesn't try to bundle them for edge/client
  serverExternalPackages: [
    'mongoose',
    'mongodb',
    'bcryptjs',
    'jsonwebtoken',
    '@google/genai',
  ],
  // Empty turbopack config to silence the webpack-vs-turbopack warning
  turbopack: {},
};

export default nextConfig;
