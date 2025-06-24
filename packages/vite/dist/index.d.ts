import { Plugin } from 'vite';

interface ReactLMViteOptions {
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
declare function reactLM(options?: ReactLMViteOptions): Plugin;

export { type ReactLMViteOptions, reactLM as default, reactLM };
