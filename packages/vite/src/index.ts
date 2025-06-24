import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export interface ReactLMViteOptions {
  providers?: {
    openrouter?: string;
    openai?: string;
    anthropic?: string;
    google?: string;
  };
  enabled?: boolean;
  mode?: 'development' | 'production';
  enableFileAccess?: boolean;
  enableHMR?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  hotkeys?: {
    toggle?: string;
    select?: string;
    chat?: string;
  };
}

export function reactLM(options: ReactLMViteOptions = {}): Plugin {
  const reactLMOptions = {
    enabled: true,
    mode: 'development' as const,
    enableFileAccess: true,
    enableHMR: true,
    theme: 'auto' as const,
    position: 'bottom-right' as const,
    hotkeys: {
      toggle: 'cmd+shift+l',
      select: 'cmd+shift+c',
      chat: 'cmd+shift+k',
    },
    ...options,
  };

  return {
    name: 'reactlm',
    
    config(config, { command }) {
      // Only enable in development mode by default
      if (!reactLMOptions.enabled && command === 'serve') {
        return;
      }

      // Add ReactLM to optimized dependencies
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      if (!config.optimizeDeps.include.includes('reactlm')) {
        config.optimizeDeps.include.push('reactlm');
      }
    },
    
    transformIndexHtml: {
      enforce: 'pre',
      transform(html, context) {
        const shouldInject = reactLMOptions.enabled && 
          (reactLMOptions.mode === 'development' ? context.server : true);

        if (!shouldInject) {
          return html;
        }

        const config = {
          ...reactLMOptions,
          mode: context.server ? 'development' : 'production',
        };

        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: {
                type: 'module',
              },
              children: `
                window.__REACT_LM_CONFIG__ = ${JSON.stringify(config)};
              `,
              injectTo: 'head',
            },
            {
              tag: 'script',
              attrs: {
                src: 'https://unpkg.com/reactlm@latest/dist/reactlm.js',
                defer: true,
              },
              injectTo: 'body',
            },
            {
              tag: 'script',
              attrs: {
                type: 'module',
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
              injectTo: 'body',
            },
          ],
        };
      },
    },
    
    configureServer(server: ViteDevServer) {
      if (!reactLMOptions.enabled || !reactLMOptions.enableFileAccess) {
        return;
      }

      // Add middleware for ReactLM file operations
      server.middlewares.use('/__reactlm', async (req: IncomingMessage, res: ServerResponse, next) => {
        if (!req.url?.startsWith('/__reactlm/')) {
          return next();
        }

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        try {
          if (req.method === 'POST' && req.url === '/__reactlm/files') {
            // Handle file modification requests
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                const { filePath, content } = JSON.parse(body);
                
                // Basic security: only allow files in src/ directory
                if (!filePath.startsWith('src/')) {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'File access restricted to src/ directory' }));
                  return;
                }

                // TODO: Implement actual file writing using Node.js fs
                // This would require careful security considerations
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  success: true, 
                  message: 'File modification would be implemented here' 
                }));
              } catch (error) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid request body' }));
              }
            });
          } else if (req.method === 'GET' && req.url === '/__reactlm/status') {
            // Health check endpoint
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              status: 'active',
              version: '0.1.0',
              features: {
                fileAccess: reactLMOptions.enableFileAccess,
                hmr: reactLMOptions.enableHMR,
              }
            }));
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          }
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });

      // Hot reload integration
      if (reactLMOptions.enableHMR) {
        server.ws.on('reactlm:update', (data) => {
          // Handle ReactLM specific hot updates
          server.ws.send('reactlm:reload', data);
        });
      }
    },
  };
}

export default reactLM;