"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  withReactLLM: () => withReactLLM
});
module.exports = __toCommonJS(index_exports);
var ReactLLMWebpackPlugin = class {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("ReactLLMWebpackPlugin", (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing?.tap(
        "ReactLLMWebpackPlugin",
        (data) => {
          const script = this.generateScript();
          data.html = data.html.replace("</head>", `${script}</head>`);
        }
      );
    });
  }
  generateScript() {
    const config = {
      ...this.options,
      mode: this.options.mode || "development",
      enableFileAccess: this.options.enableFileAccess ?? true
    };
    return `
      <script>
        window.__REACT_LLM_CONFIG__ = ${JSON.stringify(config)};
      </script>
      <script src="https://unpkg.com/react-llm@latest/dist/react-llm.js" defer></script>
      <script>
        window.addEventListener('DOMContentLoaded', () => {
          if (window.ReactLLM && window.__REACT_LLM_CONFIG__) {
            window.ReactLLM.init(window.__REACT_LLM_CONFIG__);
          }
        });
      </script>
    `;
  }
};
function withReactLLM(nextConfig = {}, options = {}) {
  const reactLLMOptions = {
    enabled: true,
    mode: "development",
    enableFileAccess: true,
    enableHMR: true,
    theme: "auto",
    position: "bottom-right",
    hotkeys: {
      toggle: "cmd+shift+l",
      select: "cmd+shift+c",
      chat: "cmd+shift+k"
    },
    ...options
  };
  return {
    ...nextConfig,
    webpack(config, context) {
      const shouldInject = reactLLMOptions.enabled && (reactLLMOptions.mode === "development" ? context.dev : true);
      if (shouldInject) {
        config.plugins = config.plugins || [];
        config.plugins.push(new ReactLLMWebpackPlugin(reactLLMOptions));
      }
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }
      return config;
    },
    // Enable experimental features for file system access
    experimental: {
      ...nextConfig.experimental,
      ...reactLLMOptions.enableFileAccess && {
        serverComponentsExternalPackages: ["react-llm"]
      }
    },
    // Add headers for React LLM
    async headers() {
      const headers = await nextConfig.headers?.() || [];
      if (reactLLMOptions.enabled) {
        headers.push({
          source: "/:path*",
          headers: [
            {
              key: "X-React-LLM-Enabled",
              value: "true"
            },
            {
              key: "X-React-LLM-Version",
              value: process.env.npm_package_version || "0.1.0"
            }
          ]
        });
      }
      return headers;
    }
  };
}
var index_default = withReactLLM;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  withReactLLM
});
