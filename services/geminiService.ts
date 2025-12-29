
import { GoogleGenAI, Type } from "@google/genai";
import { HotelContext, MarketAnalysis } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Correctly initialize the GoogleGenAI client using the environment variable directly as a named parameter.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateActionPlan(context: HotelContext): Promise<MarketAnalysis> {
    const prompt = `
      Act as a Senior Revenue & Guest Experience Consultant for a mid-sized city hotel in ${context.city}.
      Goal: Increase profitability by ${context.targetProfitability}% in ${context.timeframe} months.
      
      Current Metrics:
      - RevPAR: $${context.currentRevPAR} | ADR: $${context.currentADR} | Occupancy: ${context.currentOccupancy}%

      Tasks:
      1. Use Google Search for real-time market data in ${context.city} (competitor rates, upcoming events, local demand).
      2. Analyze (simulated) transaction patterns: High business travel during weekdays, family leisure on weekends, significant untapped spa/dining potential.
      3. Identify 3 distinct guest segments with specific characteristics.
      4. Create personalized offers for each segment (upgrades, spa, dining, local tours) with delivery channel strategies (pre-arrival email, app notification, check-in).
      5. Provide Dynamic Pricing recommendations: Adjust room rates based on current market trends found via search.
      6. Provide a structured action plan for Revenue, Ops, Guest Exp, and Tech.

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
              },
              segments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    percentage: { type: Type.NUMBER },
                    characteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    personalizedOffers: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          deliveryChannel: { type: Type.STRING }
                        },
                        required: ['title', 'description', 'deliveryChannel']
                      }
                    }
                  },
                  required: ['name', 'percentage', 'characteristics', 'personalizedOffers']
                }
              },
              rateAdjustments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    segment: { type: Type.STRING },
                    currentRate: { type: Type.NUMBER },
                    recommendedRate: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ['segment', 'currentRate', 'recommendedRate', 'reason']
                }
              }
            },
            required: ['marketSentiment', 'competitorTrends', 'recommendations', 'segments', 'rateAdjustments']
          }
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      
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
