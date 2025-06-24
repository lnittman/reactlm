import type { NextConfig } from 'next';
import path from 'path';

export interface ReactLMOptions {
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

class ReactLMWebpackPlugin {
  private options: ReactLMOptions;

  constructor(options: ReactLMOptions) {
    this.options = options;
  }

  apply(compiler: any) {
    compiler.hooks.compilation.tap('ReactLMWebpackPlugin', (compilation: any) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing?.tap(
        'ReactLMWebpackPlugin',
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
}

export function withReactLM(
  nextConfig: NextConfig = {},
  options: ReactLMOptions = {}
): NextConfig {
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
    ...nextConfig,
    
    webpack(config, context) {
      const shouldInject = reactLMOptions.enabled && 
        (reactLMOptions.mode === 'development' ? context.dev : true);

      if (shouldInject) {
        config.plugins = config.plugins || [];
        config.plugins.push(new ReactLMWebpackPlugin(reactLMOptions));
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
      ...(reactLMOptions.enableFileAccess && {
        serverComponentsExternalPackages: ['reactlm'],
      }),
    },
    
    // Add headers for ReactLM
    async headers() {
      const headers = await nextConfig.headers?.() || [];
      
      if (reactLMOptions.enabled) {
        headers.push({
          source: '/:path*',
          headers: [
            {
              key: 'X-ReactLM-Enabled',
              value: 'true',
            },
            {
              key: 'X-ReactLM-Version',
              value: process.env.npm_package_version || '0.1.0',
            },
          ],
        });
      }
      
      return headers;
    },
  };
}

export default withReactLM;