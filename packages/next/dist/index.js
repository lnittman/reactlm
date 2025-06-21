// src/index.ts
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
export {
  index_default as default,
  withReactLLM
};
