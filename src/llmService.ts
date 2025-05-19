// src/llmService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Replace with your actual API key and consider using environment variables or a secure storage mechanism.
const API_KEY: string = "YOUR_GEMINI_API_KEY"; // Replace with your key

if (API_KEY === "YOUR_GEMINI_API_KEY") {
  console.warn(
    "Please replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key in llmService.ts"
  );
  alert(
    "Please replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key in llmService.ts"
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);
// TODO: List available models and update the model name below if needed.
// Example: const model = genAI.getGenerativeModel({ model: "MODEL_NAME_FROM_API" });
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Update this if 'gemini-pro' is not available

// Updated interface to match the new vulnerability object array format
interface VulnerabilityFinding {
  vulnerability_id: string;
  category: string;
  subcategory: string;
  severity_suggestion: string;
  location_or_evidence: string;
  description: string;
  remediation_suggestion: string;
}

// The analysis function now expects a JSON object as input and returns an array of findings
export async function analyzeScreenContent(pageData: {
  url: string;
  html_dom: string;
  visible_text: string;
  cookies?: Array<{
    name: string;
    secure: boolean;
    sameSite: string;
  }>;
}): Promise<VulnerabilityFinding[]> {
  const prompt = `You are an expert cybersecurity analyst specializing in client-side web application security reviews. Your task is to analyze the provided web page data and identify potential security vulnerabilities and weaknesses.\n\nInput Data (JSON):\n\n\n${JSON.stringify(
    pageData,
    null,
    2
  )}\n\nYour Analysis Should Focus On (but not be limited to):\n\n1. Information Disclosure (PII, secrets, verbose errors, sensitive comments, etc.)\n2. Potential Cross-Site Scripting (XSS) Indicators (user input, reflection, JS patterns, outdated libs)\n3. Insecure UI/UX Practices (mixed content, target=_blank, open redirects)\n4. Cookie Security (flags, SameSite, Secure)\n5. Input Validation Weaknesses (client-side indicators)\n\nOutput Format:\n\nPlease provide your findings as a JSON array of objects. Each object should represent a distinct potential vulnerability and have the following structure:\n\n[\n  {\n    \"vulnerability_id\": \"VULN-001\",\n    \"category\": \"Information Disclosure\",\n    \"subcategory\": \"PII Exposure\",\n    \"severity_suggestion\": \"Medium\",\n    \"location_or_evidence\": \"Text content near footer: 'Contact us at admin@example.com'\",\n    \"description\": \"An email address, potentially PII, is directly visible on the page.\",\n    \"remediation_suggestion\": \"Review if this email address needs to be public. If it's for a specific user, consider masking or removing it. For general contact, ensure it's an intended public contact point.\"\n  }\n  // ... more vulnerability objects\n]\n\nReturn only the JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("LLM Raw Response:", text);

    // Attempt to extract the JSON array from the LLM response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let parsedResult: VulnerabilityFinding[];

    if (jsonMatch && jsonMatch[1]) {
      parsedResult = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback if the ```json ``` block is not found, try parsing the whole text
      try {
        parsedResult = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse LLM response as JSON directly:", e);
        console.error("LLM text that failed parsing:", text);
        // Provide a default error structure if parsing fails completely
        return [
          {
            vulnerability_id: "VULN-ERROR",
            category: "Parsing Error",
            subcategory: "LLM Output",
            severity_suggestion: "Informational",
            location_or_evidence: "LLM response could not be parsed as JSON.",
            description:
              "The LLM did not return a valid JSON array of vulnerability findings as specified in the prompt.",
            remediation_suggestion:
              "Ensure the LLM is configured to return only the JSON array as specified in the prompt.",
          },
        ];
      }
    }

    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return [
      {
        vulnerability_id: "VULN-API-ERROR",
        category: "API Error",
        subcategory: "Gemini API",
        severity_suggestion: "Informational",
        location_or_evidence: `Error: ${(error as Error).message}`,
        description: "An error occurred while calling the Gemini API.",
        remediation_suggestion:
          "Check API key, network connection, and Gemini API status.",
      },
    ];
  }
}
