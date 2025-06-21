import { Plugin } from 'vite';

interface ReactLLMViteOptions {
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
declare function reactLLM(options?: ReactLLMViteOptions): Plugin;

export { type ReactLLMViteOptions, reactLLM as default, reactLLM };
