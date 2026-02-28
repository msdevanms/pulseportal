import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from "../types";

export async function fetchLivePulse(query: string): Promise<NewsItem[]> {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Fetch the ABSOLUTE LATEST, BREAKING news and real-time social media updates for: "${query}". 
    
    CRITICAL: Focus on events that have happened in the last 60 minutes if possible, or the most recent reports available today (${new Date().toLocaleString()}). Avoid stale news from yesterday unless it is still developing.
    
    IMPORTANT: If the query is in Malayalam or Hindi, or if it's about a region where these languages are spoken, provide the title and description in that specific language (Malayalam or Hindi).
    
    Provide a list of at least 8 items.
    For each item, include:
    - A catchy, headline-style title (in the detected/requested language)
    - A brief, engaging description (2-3 sentences, in the detected/requested language)
    - A source name (e.g., "Twitter", "BBC News", "Manorama Online", "Dainik Bhaskar")
    - A realistic URL to the source
    - A high-quality placeholder image URL (use https://picsum.photos/seed/{id}/800/600)
    - A specific location mentioned in the news (city, country) with its latitude and longitude.
    - A relative timestamp (e.g., "2m ago", "1h ago", "Just now").
    - 2-3 relevant keywords or tags for this specific item.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            url: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            source: { type: Type.STRING },
            publishedAt: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            location: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              },
              required: ["name", "lat", "lng"]
            }
          },
          required: ["id", "title", "description", "source", "publishedAt", "location"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
