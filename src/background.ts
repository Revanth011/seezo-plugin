/// <reference types="chrome" />

import { analyzeScreenContent } from "./llmService";

// src/background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeScreen") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.scripting
          .executeScript({
            target: { tabId: activeTab.id },
            files: ["src/content.js"], // Use JS file for Chrome extension compatibility
          })
          .then(() => {
            chrome.tabs.sendMessage(
              activeTab.id!,
              { action: "getScreenContent" },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error sending message to content script:",
                    chrome.runtime.lastError.message
                  );
                  sendResponse({ error: chrome.runtime.lastError.message });
                  return;
                }
                if (response && response.pageData) {
                  analyzeScreenContent(response.pageData)
                    .then((analysis) => {
                      sendResponse({ analysis });
                    })
                    .catch((error) => {
                      console.error("Error calling LLM service:", error);
                      sendResponse({ error: "Failed to analyze screen." });
                    });
                } else {
                  sendResponse({ error: "Could not get screen content." });
                }
              }
            );
          })
          .catch((error) => {
            console.error("Error injecting script: ", error);
            sendResponse({ error: "Failed to inject content script." });
          });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

console.log("Background script loaded.");

export {};
