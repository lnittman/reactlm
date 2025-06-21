// src/index.ts
function reactLLM(options = {}) {
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
    name: "react-llm",
    config(config, { command }) {
      if (!reactLLMOptions.enabled && command === "serve") {
        return;
      }
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      if (!config.optimizeDeps.include.includes("react-llm")) {
        config.optimizeDeps.include.push("react-llm");
      }
    },
    transformIndexHtml: {
      enforce: "pre",
      transform(html, context) {
        const shouldInject = reactLLMOptions.enabled && (reactLLMOptions.mode === "development" ? context.server : true);
        if (!shouldInject) {
          return html;
        }
        const config = {
          ...reactLLMOptions,
          mode: context.server ? "development" : "production"
        };
        return {
          html,
          tags: [
            {
              tag: "script",
              attrs: {
                type: "module"
              },
              children: `
                window.__REACT_LLM_CONFIG__ = ${JSON.stringify(config)};
              `,
              injectTo: "head"
            },
            {
              tag: "script",
              attrs: {
                src: "https://unpkg.com/react-llm@latest/dist/react-llm.js",
                defer: true
              },
              injectTo: "body"
            },
            {
              tag: "script",
              attrs: {
                type: "module"
              },
              children: `
                // Wait for React LLM to load
                function initReactLLM() {
                  if (window.ReactLLM && window.__REACT_LLM_CONFIG__) {
                    window.ReactLLM.init(window.__REACT_LLM_CONFIG__);
                  } else {
                    setTimeout(initReactLLM, 100);
                  }
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initReactLLM);
                } else {
                  initReactLLM();
                }
              `,
              injectTo: "body"
            }
          ]
        };
      }
    },
    configureServer(server) {
      if (!reactLLMOptions.enabled || !reactLLMOptions.enableFileAccess) {
        return;
      }
      server.middlewares.use("/__react-llm", async (req, res, next) => {
        if (!req.url?.startsWith("/__react-llm/")) {
          return next();
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }
        try {
          if (req.method === "POST" && req.url === "/__react-llm/files") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", async () => {
              try {
                const { filePath, content } = JSON.parse(body);
                if (!filePath.startsWith("src/")) {
                  res.statusCode = 403;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "File access restricted to src/ directory" }));
                  return;
                }
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                  success: true,
                  message: "File modification would be implemented here"
                }));
              } catch (error) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Invalid request body" }));
              }
            });
          } else if (req.method === "GET" && req.url === "/__react-llm/status") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              status: "active",
              version: "0.1.0",
              features: {
                fileAccess: reactLLMOptions.enableFileAccess,
                hmr: reactLLMOptions.enableHMR
              }
            }));
          } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Endpoint not found" }));
          }
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
      if (reactLLMOptions.enableHMR) {
        server.ws.on("react-llm:update", (data) => {
          server.ws.send("react-llm:reload", data);
        });
      }
    }
  };
}
var index_default = reactLLM;
export {
  index_default as default,
  reactLLM
};
