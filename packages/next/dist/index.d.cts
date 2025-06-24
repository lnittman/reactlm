import { NextConfig } from 'next';

interface ReactLMOptions {
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
declare function withReactLM(nextConfig?: NextConfig, options?: ReactLMOptions): NextConfig;

export { type ReactLMOptions, withReactLM as default, withReactLM };
