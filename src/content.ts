/// <reference types="chrome" />

// src/content.ts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getScreenContent") {
    const url = window.location.href;
    const html_dom = document.documentElement.outerHTML;
    const visible_text = document.body.innerText;
    // Collect non-HttpOnly cookies if accessible
    let cookies: Array<{ name: string; secure: boolean; sameSite: string }> =
      [];
    if (document.cookie) {
      cookies = document.cookie.split(";").map((c) => {
        const [name] = c.trim().split("=");
        // No way to get Secure/SameSite from JS, so set as unknown/false
        return { name, secure: false, sameSite: "Unknown" };
      });
    }
    sendResponse({
      pageData: {
        url,
        html_dom,
        visible_text,
        cookies: cookies.length > 0 ? cookies : undefined,
      },
    });
  }
});

// This is a simple way to indicate the content script is loaded.
// More sophisticated checks might be needed for robust injection detection.
console.log("Content script loaded.");

export {}; // Add this line to make it a module
