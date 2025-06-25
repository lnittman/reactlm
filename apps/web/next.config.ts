import type { NextConfig } from "next";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// Helper function to copy reactlm.js
function copyReactLM() {
  const reactLMPath = join(__dirname, "../../packages/reactlm/dist/reactlm.global.global.js");
  const publicPath = join(__dirname, "public");
  const targetPath = join(publicPath, "reactlm.js");
  
  if (existsSync(reactLMPath)) {
    if (!existsSync(publicPath)) {
      mkdirSync(publicPath, { recursive: true });
    }
    copyFileSync(reactLMPath, targetPath);
    console.log("✅ Copied reactlm.js to public directory");
    return true;
  } else {
    console.warn("⚠️  reactlm.js not found. Building reactlm...");
    return false;
  }
}

// Copy on startup
copyReactLM();

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Copy reactlm build to public directory on client build
      copyReactLM();
    }
    return config;
  },
};

export default nextConfig;
