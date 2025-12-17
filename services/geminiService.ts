import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real app, handle missing key gracefully

// Singleton instance
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateChefResponse = async (
  prompt: string,
  context?: string
): Promise<string> => {
  if (!ai) {
    return "I'm sorry, I'm having trouble connecting to my brain (API Key missing).";
  }

  try {
    const modelId = 'gemini-3-flash-preview';
    const systemInstruction = `You are "Chef Bot", a friendly and knowledgeable AI assistant for a food delivery app called FlavorDash.
    Your goal is to help users choose food, explain ingredients, suggest pairings, or give fun food facts.
    Keep your answers concise (under 100 words), appetizing, and helpful.
    
    Current App Context (Menu items available):
    ${context || 'No specific context provided.'}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't come up with a tasty answer right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I burned the toast. Please try asking again later.";
  }
};