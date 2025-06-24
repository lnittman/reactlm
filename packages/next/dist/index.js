// src/index.ts
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
export {
  index_default as default,
  withReactLM
};
