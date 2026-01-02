
import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteTheme } from "../types";
import { getAIClient } from "./secure/vault";
import { hasCredits, consumeCredit } from "./secure/limiter";

export const generateLogo = async (businessName: string, industry: string, aesthetic: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A professional, sleek minimalist geometric logo for a company named "${businessName}" in the ${industry} industry. Style: ${aesthetic}. Single abstract symbol, clean lines, high resolution tech branding, isolated on a solid dark background.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Logo generation failed.");
};

export const generateThemeStructure = async (industry: string, aesthetic: string, businessName: string, subStyle: string, palettePref: string, websiteUrl?: string): Promise<WebsiteTheme> => {
  if (!hasCredits()) {
    throw new Error("Neural Capacity Exhausted: Your 4-generation limit has been reached.");
  }

  const ai = getAIClient();
  
  const prompt = `Generate a comprehensive website theme for "${businessName}" in "${industry}".
  MAIN VISUAL STYLE: ${aesthetic}.
  ${palettePref ? `COLOR PALETTE / THEME REFERENCE: ${palettePref}.` : ''}
  ${subStyle ? `CREATIVE MOTIF: ${subStyle}.` : ''}

  Rules:
  1. Accessibility: Contrast Ratio min 4.5:1.
  2. Icons: USE ONLY EMOJIS.
  3. Aesthetic: Generate premium colors optimized for a sophisticated dark theme.`;

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
    contents: prompt,
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

  const jsonStr = response.text.trim();
  if (!jsonStr) throw new Error("Inference failure.");
  
  consumeCredit();
  return JSON.parse(jsonStr) as WebsiteTheme;
};

export const generateHeroImage = async (theme: WebsiteTheme): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Professional web design hero image. Style: ${theme.aesthetic}. Subject: ${theme.imagePrompts.hero}. High quality, cinematic lighting.`.trim();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Visual synthesis failed.");
};
