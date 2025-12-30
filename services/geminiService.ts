
import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteTheme } from "../types";

export const generateThemeStructure = async (industry: string, aesthetic: string, businessName: string, subStyle: string, websiteUrl?: string): Promise<WebsiteTheme> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = `Generate a comprehensive website theme for a company named "${businessName}" in the "${industry}" industry.
  
  VISUAL STYLE OVERRIDE: The entire theme MUST be based on the aesthetic: "${aesthetic}".`;

  if (subStyle) {
    prompt += `\nSPECIFIC CHARACTER/SERIES REFERENCE: Integrate the visual language of "${subStyle}" into the design. 
    Use the color palettes, iconic motifs, and "vibe" associated with ${subStyle}. 
    If it's an anime, use related art styles (shonen, shojo, etc.). 
    If it's a specific cartoon like SpongeBob, use nautical yellow/blue colors and bubbly fonts.`;
  }
  
  prompt += `\n\n- If the aesthetic is "Cartoon" or "Playful", use vivid, high-contrast colors and whimsical icons.
  - If the aesthetic is "Minimalist", use high whitespace and subtle tones.
  - The copy and section headings must reflect the chosen vibe.`;
  
  if (websiteUrl) {
    prompt += `\n\nReference Website Analysis: The user has provided "${websiteUrl}" as a reference. 
    1. Replicate the specific information architecture and page types found on this site. 
    2. Translate the professional content of "${websiteUrl}" into the tone of "${aesthetic}" and "${subStyle}".
    3. Ensure the core functional pages are reimagined through this lens.`;
  }

  prompt += `\n\nFinal Requirement:
  - Colors: Provide valid CSS hex codes. Ensure the palette is cohesive and stunning.
  - Icons: Use descriptive single-word emojis or short descriptions for the icon field.
  - Respond ONLY in the requested JSON structure.`;

  const pageSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      heroTitle: { type: Type.STRING },
      heroSubtitle: { type: Type.STRING },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            heading: { type: Type.STRING },
            content: { type: Type.STRING },
            icon: { type: Type.STRING },
          },
          required: ["heading", "content"]
        }
      }
    },
    required: ["title", "heroTitle", "heroSubtitle", "sections"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          industry: { type: Type.STRING },
          aesthetic: { type: Type.STRING },
          colors: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING },
              secondary: { type: Type.STRING },
              accent: { type: Type.STRING },
              background: { type: Type.STRING },
              text: { type: Type.STRING },
              card: { type: Type.STRING },
            },
            required: ["primary", "secondary", "accent", "background", "text", "card"]
          },
          typography: {
            type: Type.OBJECT,
            properties: {
              headingFont: { type: Type.STRING },
              bodyFont: { type: Type.STRING },
            },
            required: ["headingFont", "bodyFont"]
          },
          pages: {
            type: Type.OBJECT,
            properties: {
              home: pageSchema,
              about: pageSchema,
              services: pageSchema,
              contact: pageSchema,
            },
            required: ["home", "about", "services", "contact"]
          },
          imagePrompts: {
            type: Type.OBJECT,
            properties: {
              hero: { type: Type.STRING },
              feature: { type: Type.STRING },
            },
            required: ["hero", "feature"]
          }
        },
        required: ["businessName", "industry", "aesthetic", "colors", "typography", "pages", "imagePrompts"],
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Thematic.ai engine failed to generate response.");
  return JSON.parse(text) as WebsiteTheme;
};

export const generateHeroImage = async (theme: WebsiteTheme): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const enrichedPrompt = `
    High-end web design hero asset.
    Core Style: ${theme.aesthetic}.
    Context: Reimagined with motifs from any specific character or show mentioned in the branding.
    Content: ${theme.imagePrompts.hero}.
    Technical: 4k, cinematic lighting, ultra-sharp detail, professional composition.
    If the style is "Cartoon" or inspired by a specific show, make it a high-quality 3D render like Pixar or a modern colorful illustration consistent with that show's art style.
  `.trim();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: enrichedPrompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Visual generation failed.");
};
