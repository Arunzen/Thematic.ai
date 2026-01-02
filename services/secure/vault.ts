
import { GoogleGenAI } from "@google/genai";

/**
 * Thematic.ai Secure Vault
 * This module manages the instantiation of sensitive AI clients.
 * It strictly adheres to platform security protocols by using process.env.API_KEY.
 */
export const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("Neural Link Error: System Environment API Key not detected.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};
