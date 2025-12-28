
import { GoogleGenAI, Type } from "@google/genai";
import { HotelContext, MarketAnalysis } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateActionPlan(context: HotelContext): Promise<MarketAnalysis> {
    const prompt = `
      Perform a deep market analysis for a mid-sized city hotel in ${context.city}.
      The owner wants to increase profitability by ${context.targetProfitability}% within ${context.timeframe} months.
      
      Current Metrics:
      - RevPAR: $${context.currentRevPAR}
      - ADR: $${context.currentADR}
      - Occupancy: ${context.currentOccupancy}%

      Tasks:
      1. Search for real-time market competitor data in ${context.city} including current ADR trends, major upcoming events (next 12-18 months), and operational cost trends.
      2. Provide a structured action plan across: Revenue Optimization, Operational Efficiency, Guest Experience, Investment Strategy, and Data-Driven Decisions.
      3. Explain market sentiment and local competition challenges.

      Return the response in JSON format.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marketSentiment: { type: Type.STRING },
              competitorTrends: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    action: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  },
                  required: ['category', 'action', 'goal', 'impact', 'priority']
                }
              }
            },
            required: ['marketSentiment', 'competitorTrends', 'recommendations']
          }
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      
      // Extract grounding sources
      const groundingSources: any[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            groundingSources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        });
      }

      return {
        ...parsed,
        groundingSources
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
