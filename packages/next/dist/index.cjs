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
  withReactLM: () => withReactLM
});
module.exports = __toCommonJS(index_exports);
var ReactLMWebpackPlugin = class {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("ReactLMWebpackPlugin", (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing?.tap(
        "ReactLMWebpackPlugin",
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
        window.__REACT_LM_CONFIG__ = ${JSON.stringify(config)};
      </script>
      <script src="https://unpkg.com/reactlm@latest/dist/reactlm.js" defer></script>
      <script>
        window.addEventListener('DOMContentLoaded', () => {
          if (window.ReactLM && window.__REACT_LM_CONFIG__) {
            window.ReactLM.init(window.__REACT_LM_CONFIG__);
          }
        });
      </script>
    `;
  }
};
function withReactLM(nextConfig = {}, options = {}) {
  const reactLMOptions = {
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
      const shouldInject = reactLMOptions.enabled && (reactLMOptions.mode === "development" ? context.dev : true);
      if (shouldInject) {
        config.plugins = config.plugins || [];
        config.plugins.push(new ReactLMWebpackPlugin(reactLMOptions));
      }
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }
      return config;
    },
    // Enable experimental features for file system access
    experimental: {
      ...nextConfig.experimental,
      ...reactLMOptions.enableFileAccess && {
        serverComponentsExternalPackages: ["reactlm"]
      }
    },
    // Add headers for ReactLM
    async headers() {
      const headers = await nextConfig.headers?.() || [];
      if (reactLMOptions.enabled) {
        headers.push({
          source: "/:path*",
          headers: [
            {
              key: "X-ReactLM-Enabled",
              value: "true"
            },
            {
              key: "X-ReactLM-Version",
              value: process.env.npm_package_version || "0.1.0"
            }
          ]
        });
      }
      return headers;
    }
  };
}
var index_default = withReactLM;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  withReactLM
});
