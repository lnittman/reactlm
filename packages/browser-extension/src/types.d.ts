// Type declarations for React LLM browser extension

interface ReactLLMConfig {
  providers?: {
    openrouter?: string;
    openai?: string;
    anthropic?: string;
    google?: string;
  };
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  autoInject?: boolean;
  mode?: 'development' | 'production';
  fileAccess?: boolean;
}

interface ReactLLM {
  init(config?: ReactLLMConfig): void;
  toggle(): void;
  show(): void;
  hide(): void;
  isVisible(): boolean;
  destroy(): void;
}

declare global {
  interface Window {
    ReactLLM?: ReactLLM;
    React?: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

// Chrome extension types
declare namespace chrome.scripting {
  interface InjectionTarget {
    tabId: number;
    frameIds?: number[];
  }
  
  interface ScriptInjection<T = any> {
    target: InjectionTarget;
    func?: () => T;
    files?: string[];
    args?: any[];
    world?: 'ISOLATED' | 'MAIN';
  }
  
  function executeScript<T = any>(
    injection: ScriptInjection<T>
  ): Promise<{ result: T }[]>;
}

export {};