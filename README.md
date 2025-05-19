# GarudaBlaze
Lighting Up Hidden Risks

GarudaBlaze is a browser extension that performs automated security design reviews on any given screen. It leverages the Gemini LLM for intelligent analysis and provides instant feedback on high-level security risks and sensitive assets present on web pages.

## Features

- **Automated Security Review:** Analyze any web page for security risks with a single click.
- **Asset Identification:** Detects sensitive assets such as PII, tokens, and more.
- **LLM-Powered Analysis:** Uses the Gemini model for context-aware, nuanced security insights.
- **Modern UI:** Built with React and Vite for a fast, responsive experience.

## How It Works

1. **Extracts Page Content:** The extension captures visible text and structure from the current web page.
2. **Sends Data to Gemini:** The captured data is sent to the Gemini LLM for analysis.
3. **Displays Results:** Security risks and sensitive assets are displayed in the extension popup.

## Tech Stack

- Vite
- React
- TypeScript
- Gemini LLM (Google Generative AI)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- A Gemini API key from Google Generative AI

### Installation

1. Clone this repository:
   ```powershell
   git clone <your-repo-url>
   cd vite-project
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Add your Gemini API key:
   - Open `src/llmService.ts` and replace the placeholder with your actual API key.
4. Build the extension:
   ```powershell
   npm run build
   ```
5. Load the extension in your browser:
   - Go to your browser's extensions page (e.g., `chrome://extensions/` for Chrome).
   - Enable Developer Mode.
   - Click "Load unpacked" and select the `dist` folder.

## Usage

- Click the GarudaBlaze icon in your browser.
- Click "Analyze Current Screen" to review the current page.
- View identified security risks and sensitive assets in the popup.

## Customization

- Update the LLM prompt or model in `src/llmService.ts` as needed.
- Change branding or UI in `src/App.tsx` and `src/App.css`.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

## Credits

- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Powered by [Google Generative AI (Gemini)](https://ai.google.dev/)

---

**GarudaBlaze** — Lighting Up Hidden Risks
