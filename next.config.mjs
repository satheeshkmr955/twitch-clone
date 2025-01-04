/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "twitch-clone.s3.amazonaws.com",
        port: "",
        pathname: "/profile-images/**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@whatwg-node/server", "@whatwg-node", "@opentelemetry/sdk-node"],
    instrumentationHook: true,
  },
  webpack(config, { isServer }) {
    config.externals.push({
      "node:crypto": "commonjs crypto",
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
