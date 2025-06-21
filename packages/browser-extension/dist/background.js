"use strict";
// Background script for React LLM browser extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('React LLM extension installed');
});
chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: toggleReactLLM,
        });
    }
});
function toggleReactLLM() {
    // This function runs in the context of the web page
    if (window.ReactLLM) {
        // Toggle existing instance
        window.ReactLLM.toggle();
    }
    else {
        // Inject React LLM if not already present
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('react-llm.js');
        script.onload = () => {
            if (window.ReactLLM) {
                // Get stored configuration
                chrome.storage.sync.get(['reactLLMConfig'], (result) => {
                    const config = result.reactLLMConfig || {};
                    window.ReactLLM?.init(config);
                });
            }
        };
        document.head.appendChild(script);
    }
}
// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getConfig') {
        chrome.storage.sync.get(['reactLLMConfig'], (result) => {
            sendResponse(result.reactLLMConfig || {});
        });
        return true; // Keep message channel open for async response
    }
    if (request.action === 'saveConfig') {
        chrome.storage.sync.set({ reactLLMConfig: request.config }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});
//# sourceMappingURL=background.js.map