/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["fabric", "wallpaper-motion-studio"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;