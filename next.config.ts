import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://xizeltazwbxsaphjdtfo.supabase.co/**')],
  },
  // output: "export"
};

export default nextConfig;
