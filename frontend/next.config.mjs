/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  api: {
    bodyParser: {
      sizeLimit: "20mb", // ou plus si besoin
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // permet aussi aux Server Actions de recevoir + de 1 MB
    },
  },
};

export default nextConfig;
