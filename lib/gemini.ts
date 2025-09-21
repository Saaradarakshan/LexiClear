// lib/gemini-client.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
let genAI: GoogleGenerativeAI | null = null;

export function initializeGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.warn("GOOGLE_API_KEY not found. Using mock responses.");
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    return null;
  }
}

export async function simplifyLegalText(legalText: string): Promise<string> {
  // Initialize if not already done
  if (!genAI) {
    initializeGeminiClient();
  }

  // If still no genAI (no API key), return mock response
  if (!genAI) {
    return `Simplified version (mock - API not configured):

This is a placeholder response because no Google Gemini API key is configured.

To enable real AI-powered document simplification:
1. Get a Google Gemini API key from https://makersuite.google.com/
2. Add it to your .env.local file as GOOGLE_API_KEY=your_key_here
3. Restart your development server

Original text preview: "${legalText.substring(0, 100)}${legalText.length > 100 ? '...' : ''}"`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a legal expert that simplifies complex legal documents into plain English. 
    Please simplify the following legal text for a non-lawyer audience:
    
    - Replace legal jargon with simple, everyday language
    - Keep the meaning accurate but make it easy to understand
    - Use short sentences and clear formatting
    - Add section headings if helpful for organization
    
    Legal text to simplify:
    ${legalText}
    
    Simplified version:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return `Error simplifying document: ${error.message}. Please check your API key and try again.`;
  }
}