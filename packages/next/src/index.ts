import type { NextConfig } from 'next';
import path from 'path';

export interface ReactLLMOptions {
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

class ReactLLMWebpackPlugin {
  private options: ReactLLMOptions;

  constructor(options: ReactLLMOptions) {
    this.options = options;
  }

  apply(compiler: any) {
    compiler.hooks.compilation.tap('ReactLLMWebpackPlugin', (compilation: any) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing?.tap(
        'ReactLLMWebpackPlugin',
        (data: any) => {
          const script = this.generateScript();
          data.html = data.html.replace('</head>', `${script}</head>`);
        }
      );
    });
  }

  private generateScript(): string {
    const config = {
      ...this.options,
      mode: this.options.mode || 'development',
      enableFileAccess: this.options.enableFileAccess ?? true,
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
}

export function withReactLLM(
  nextConfig: NextConfig = {},
  options: ReactLLMOptions = {}
): NextConfig {
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
    ...nextConfig,
    
    webpack(config, context) {
      const shouldInject = reactLLMOptions.enabled && 
        (reactLLMOptions.mode === 'development' ? context.dev : true);

      if (shouldInject) {
        config.plugins = config.plugins || [];
        config.plugins.push(new ReactLLMWebpackPlugin(reactLLMOptions));
      }
      
      // Call existing webpack config
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, context);
      }
      
      return config;
    },
    
    // Enable experimental features for file system access
    experimental: {
      ...nextConfig.experimental,
      ...(reactLLMOptions.enableFileAccess && {
        serverComponentsExternalPackages: ['react-llm'],
      }),
    },
    
    // Add headers for React LLM
    async headers() {
      const headers = await nextConfig.headers?.() || [];
      
      if (reactLLMOptions.enabled) {
        headers.push({
          source: '/:path*',
          headers: [
            {
              key: 'X-React-LLM-Enabled',
              value: 'true',
            },
            {
              key: 'X-React-LLM-Version',
              value: process.env.npm_package_version || '0.1.0',
            },
          ],
        });
      }
      
      return headers;
    },
  };
}

export default withReactLLM;