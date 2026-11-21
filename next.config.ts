import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The certificate route reads the PDF template and fonts from disk at runtime;
  // make sure they are bundled into its serverless function on Vercel.
  outputFileTracingIncludes: {
    '/api/certificates/[id]/download': ['./src/assets/certificate/**/*'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    }
  }
};

export default nextConfig;
