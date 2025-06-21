import type { NextConfig } from "next";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// Helper function to copy react-llm.js
function copyReactLLM() {
  const reactLLMPath = join(__dirname, "../../packages/react-llm/dist/react-llm.global.js");
  const publicPath = join(__dirname, "public");
  const targetPath = join(publicPath, "react-llm.js");
  
  if (existsSync(reactLLMPath)) {
    if (!existsSync(publicPath)) {
      mkdirSync(publicPath, { recursive: true });
    }
    copyFileSync(reactLLMPath, targetPath);
    console.log("✅ Copied react-llm.js to public directory");
    return true;
  } else {
    console.warn("⚠️  react-llm.js not found. Building react-llm...");
    return false;
  }
}

// Copy on startup
copyReactLLM();

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Copy react-llm build to public directory on client build
      copyReactLLM();
    }
    return config;
  },
};

export default nextConfig;
