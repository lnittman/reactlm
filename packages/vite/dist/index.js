// src/index.ts
function reactLM(options = {}) {
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
    name: "reactlm",
    config(config, { command }) {
      if (!reactLMOptions.enabled && command === "serve") {
        return;
      }
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      if (!config.optimizeDeps.include.includes("reactlm")) {
        config.optimizeDeps.include.push("reactlm");
      }
    },
    transformIndexHtml: {
      enforce: "pre",
      transform(html, context) {
        const shouldInject = reactLMOptions.enabled && (reactLMOptions.mode === "development" ? context.server : true);
        if (!shouldInject) {
          return html;
        }
        const config = {
          ...reactLMOptions,
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
                window.__REACT_LM_CONFIG__ = ${JSON.stringify(config)};
              `,
              injectTo: "head"
            },
            {
              tag: "script",
              attrs: {
                src: "https://unpkg.com/reactlm@latest/dist/reactlm.js",
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
                // Wait for ReactLM to load
                function initReactLM() {
                  if (window.ReactLM && window.__REACT_LM_CONFIG__) {
                    window.ReactLM.init(window.__REACT_LM_CONFIG__);
                  } else {
                    setTimeout(initReactLM, 100);
                  }
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initReactLM);
                } else {
                  initReactLM();
                }
              `,
              injectTo: "body"
            }
          ]
        };
      }
    },
    configureServer(server) {
      if (!reactLMOptions.enabled || !reactLMOptions.enableFileAccess) {
        return;
      }
      server.middlewares.use("/__reactlm", async (req, res, next) => {
        if (!req.url?.startsWith("/__reactlm/")) {
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
          if (req.method === "POST" && req.url === "/__reactlm/files") {
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
          } else if (req.method === "GET" && req.url === "/__reactlm/status") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              status: "active",
              version: "0.1.0",
              features: {
                fileAccess: reactLMOptions.enableFileAccess,
                hmr: reactLMOptions.enableHMR
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
      if (reactLMOptions.enableHMR) {
        server.ws.on("reactlm:update", (data) => {
          server.ws.send("reactlm:reload", data);
        });
      }
    }
  };
}
var index_default = reactLM;
export {
  index_default as default,
  reactLM
};
