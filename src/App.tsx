/// <reference types="chrome" />

import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { analyzeScreenContent } from "./llmService";
import type { VulnerabilityFinding } from "./types";

function App() {
  const [analysis, setAnalysis] = useState<VulnerabilityFinding[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    // Get the current tab URL to display it
    if (chrome.tabs) {
      // Check if chrome.tabs API is available (i.e., running as an extension)
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.url) {
          setCurrentUrl(activeTab.url);
        }
      });
    } else {
      // Fallback for development when not running as an extension
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleAnalyze = () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    if (chrome.runtime && chrome.runtime.sendMessage) {
      // Running as an extension
      chrome.runtime.sendMessage({ action: "analyzeScreen" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to background script:",
            chrome.runtime.lastError.message
          );
          setError(`Error: ${chrome.runtime.lastError.message}`);
          setIsLoading(false);
          return;
        }
        if (response && response.error) {
          setError(response.error);
          setAnalysis(null);
        } else if (response && response.analysis) {
          setAnalysis(response.analysis);
        } else {
          setError(
            "Received an unexpected response from the background script."
          );
        }
        setIsLoading(false);
      });
    } else {
      // Fallback for development (e.g. running with `npm run dev`)
      // In a real scenario, you might mock this or have a different dev setup.
      console.warn(
        "chrome.runtime.sendMessage is not available. Simulating API call for development."
      );
      // Simulate getting screen content and calling LLM directly
      const screenText =
        document.body.innerText ||
        "This is simulated screen content for development. The actual extension will use the live page content.";
      // For dev, simulate minimal pageData
      const pageData = {
        url: window.location.href,
        html_dom: document.documentElement.outerHTML,
        visible_text: screenText,
      };
      analyzeScreenContent(pageData)
        .then((simulatedAnalysis) => {
          setAnalysis(simulatedAnalysis);
        })
        .catch((err) => {
          setError(`Error during simulated analysis: ${err.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GarudaBlaze</h1>
        <p style={{ fontStyle: "italic", fontSize: "1.1em", margin: 0 }}>
          Lighting Up Hidden Risks
        </p>
        {currentUrl && <p className="current-url">Reviewing: {currentUrl}</p>}
      </header>
      <main>
        <button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Current Screen"}
        </button>

        {error && (
          <div className="results-container error-container">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <div className="results-container">
            {Array.isArray(analysis) && analysis.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Severity</th>
                    <th>Location/Evidence</th>
                    <th>Description</th>
                    <th>Remediation</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.map((finding, idx) => (
                    <tr key={finding.vulnerability_id || idx}>
                      <td>{finding.vulnerability_id}</td>
                      <td>{finding.category}</td>
                      <td>{finding.subcategory}</td>
                      <td>{finding.severity_suggestion}</td>
                      <td>{finding.location_or_evidence}</td>
                      <td>{finding.description}</td>
                      <td>{finding.remediation_suggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No vulnerabilities identified.</p>
            )}
          </div>
        )}
      </main>
      <footer>
        <p>
          Remember to replace 'YOUR_GEMINI_API_KEY' in{" "}
          <code>src/llmService.ts</code>.
        </p>
      </footer>
    </div>
  );
}

export default App;
