/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the 'output' property or set it to a different value

  // Add the 'images' property to disable image optimization
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
