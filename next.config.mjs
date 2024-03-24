/** @type {import('next').NextConfig} */
const nextConfig = {
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
    serverComponentsExternalPackages: ["@whatwg-node/server", "@whatwg-node"],
  },
};

export default nextConfig;
