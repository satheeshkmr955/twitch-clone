/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@whatwg-node/server", "@whatwg-node"],
  },
};

export default nextConfig;
