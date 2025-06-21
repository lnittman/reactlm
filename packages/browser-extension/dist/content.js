"use strict";
// Content script for React LLM browser extension
// Check if React is present on the page
function detectReact() {
    return !!(window.React ||
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        document.querySelector('[data-reactroot]') ||
        document.querySelector('[data-react-checksum]') ||
        Array.from(document.querySelectorAll('*')).some(el => Object.keys(el).some(key => key.startsWith('__react'))));
}
// Inject React LLM automatically if React is detected and auto-inject is enabled
async function autoInject() {
    if (!detectReact())
        return;
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
        const config = response || {};
        if (config.autoInject !== false) { // Default to true
            injectReactLLM(config);
        }
    }
    catch (error) {
        console.warn('React LLM: Could not get configuration', error);
    }
}
function injectReactLLM(config) {
    if (window.ReactLLM)
        return; // Already injected
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('react-llm.js');
    script.onload = () => {
        if (window.ReactLLM) {
            window.ReactLLM.init({
                ...config,
                mode: 'production', // Extension always runs in production mode
                fileAccess: false, // No file access in extension mode
            });
        }
    };
    document.head.appendChild(script);
}
// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
        if (window.ReactLLM) {
            window.ReactLLM.toggle();
        }
        else {
            chrome.runtime.sendMessage({ action: 'getConfig' }, (config) => {
                injectReactLLM(config || {});
            });
        }
        sendResponse({ success: true });
    }
    if (request.action === 'getPageInfo') {
        sendResponse({
            hasReact: detectReact(),
            hasReactLLM: !!window.ReactLLM,
            url: window.location.href,
        });
    }
});
// Auto-inject on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInject);
}
else {
    autoInject();
}
//# sourceMappingURL=content.js.map