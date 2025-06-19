import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export interface ReactLLMViteOptions {
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

export function reactLLM(options: ReactLLMViteOptions = {}): Plugin {
  const reactLLMOptions = {
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
    name: 'react-llm',
    
    config(config, { command }) {
      // Only enable in development mode by default
      if (!reactLLMOptions.enabled && command === 'serve') {
        return;
      }

      // Add React LLM to optimized dependencies
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      if (!config.optimizeDeps.include.includes('react-llm')) {
        config.optimizeDeps.include.push('react-llm');
      }
    },
    
    transformIndexHtml: {
      enforce: 'pre',
      transform(html, context) {
        const shouldInject = reactLLMOptions.enabled && 
          (reactLLMOptions.mode === 'development' ? context.server : true);

        if (!shouldInject) {
          return html;
        }

        const config = {
          ...reactLLMOptions,
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
                window.__REACT_LLM_CONFIG__ = ${JSON.stringify(config)};
              `,
              injectTo: 'head',
            },
            {
              tag: 'script',
              attrs: {
                src: 'https://unpkg.com/react-llm@latest/dist/react-llm.js',
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
              injectTo: 'body',
            },
          ],
        };
      },
    },
    
    configureServer(server: ViteDevServer) {
      if (!reactLLMOptions.enabled || !reactLLMOptions.enableFileAccess) {
        return;
      }

      // Add middleware for React LLM file operations
      server.middlewares.use('/__react-llm', async (req: IncomingMessage, res: ServerResponse, next) => {
        if (!req.url?.startsWith('/__react-llm/')) {
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
          if (req.method === 'POST' && req.url === '/__react-llm/files') {
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
          } else if (req.method === 'GET' && req.url === '/__react-llm/status') {
            // Health check endpoint
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              status: 'active',
              version: '0.1.0',
              features: {
                fileAccess: reactLLMOptions.enableFileAccess,
                hmr: reactLLMOptions.enableHMR,
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
      if (reactLLMOptions.enableHMR) {
        server.ws.on('react-llm:update', (data) => {
          // Handle React LLM specific hot updates
          server.ws.send('react-llm:reload', data);
        });
      }
    },
  };
}

export default reactLLM;