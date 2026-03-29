import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateColoringPage(
  prompt: string,
  category: string,
  thickness: string,
  detail: string,
  background: string,
  affirmation?: string
): Promise<string> {
  const enhancedPrompt = `
    A clean, black and white line art coloring page of ${prompt}.
    Category/Style: ${category}.
    Line thickness: ${thickness}.
    Detail level: ${detail}.
    Background: ${background}.
    ${affirmation ? `Include the text/affirmation: "${affirmation}" integrated beautifully into the design.` : ''}
    
    CRITICAL INSTRUCTIONS:
    - Strictly black and white line art ONLY.
    - NO shading, NO grayscale, NO colors.
    - Pure white background, pure black crisp lines.
    - Optimized for a physical coloring book.
    - High contrast, clear boundaries for coloring.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: enhancedPrompt,
      config: {
        // @ts-ignore - imageConfig is valid for image models
        imageConfig: {
          aspectRatio: "3:4", // Good for coloring pages
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
