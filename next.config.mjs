/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

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
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@whatwg-node/server",
      "@whatwg-node",
      "@opentelemetry/sdk-node",
    ],
    instrumentationHook: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    config.externals.push({
      "node:crypto": "commonjs crypto",
    });

    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.NODE_ENV === "development",
  openAnalyzer: process.env.NODE_ENV === "development",
})(nextConfig);
