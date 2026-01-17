
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, SkillGapAnalysis, Sector, PortfolioStrategy, Opportunity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robust Roadmap Generation
 * Uses gemini-3-flash-preview for speed and reliability.
 * Includes a strict retry-safe prompt.
 */
export const generatePersonalizedRoadmap = async (profile: UserProfile): Promise<SkillGapAnalysis> => {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `ACT AS A SENIOR CAREER ARCHITECT. 
      Generate a professional 4-week mastery roadmap for ${profile.name}.
      CONTEXT:
      - Sector: ${profile.sector}
      - Target Goal: ${profile.goal}
      - Current Proficiency: ${profile.level}
      - Daily Time Commitment: ${profile.studyHoursPerDay} hours
      - Existing Skills: ${profile.skills.join(', ')}

      OUTPUT MUST BE VALID JSON.`,
      config: {
        temperature: 0.1, // Lower temperature for more consistent JSON structure
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.NUMBER },
                  topic: { type: Type.STRING },
                  description: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedCourses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        platform: { type: Type.STRING },
                        url: { type: Type.STRING }
                      },
                      required: ["title", "platform"]
                    }
                  }
                },
                required: ["week", "topic", "description", "tasks", "suggestedCourses"]
              }
            },
            featuredProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  description: { type: Type.STRING },
                  milestones: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "difficulty", "description"]
              }
            },
            readinessScore: { type: Type.NUMBER },
            baselineScore: { type: Type.NUMBER }
          },
          required: ["missingSkills", "recommendation", "roadmap", "featuredProjects", "readinessScore", "baselineScore"]
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("AI returned empty content");
    return JSON.parse(text);
  } catch (error) {
    console.error("Roadmap failure:", error);
    // Fallback simple structure to prevent app crash
    throw new Error("Neural synthesis failed. The model is recalibrating. Please try again in a few seconds.");
  }
};

/**
 * Portfolio Builder Strategy
 * Smart analysis of how to present skills logically.
 */
export const generatePortfolioStrategy = async (profile: UserProfile): Promise<PortfolioStrategy> => {
  const model = 'gemini-3-flash-preview';
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Design a high-impact portfolio strategy for ${profile.name} in ${profile.sector}. Goal: ${profile.goal}. Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tagline: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            personalBrandAdvice: { type: Type.STRING },
            suggestedCaseStudies: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["tagline", "sections", "personalBrandAdvice", "suggestedCaseStudies"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw new Error("Failed to generate portfolio strategy.");
  }
};

/**
 * Real-time Market Intelligence
 * Fetches current sector opportunities using Google Search grounding.
 * Fixes missing member error in components/OpportunitiesView.tsx.
 */
export const fetchOpportunities = async (sector: Sector): Promise<Opportunity[]> => {
  const model = 'gemini-3-flash-preview';
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Search for 5 active career opportunities (internships, roles, or fellowships) in the ${sector} industry. 
      For each, provide: 
      - title: name of the role
      - organization: the company
      - type: "Job", "Internship", or "Program"
      - description: brief summary
      - url: direct link to the source or application
      
      Return results as a VALID JSON array.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || '';
    // Extraction via regex is used as grounding results can sometimes be conversational
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Market search failed:", error);
    return [];
  }
};

/**
 * Enhanced Mentor Logic
 */
export const createMentorChat = (sector: Sector, name: string) => {
  const personas: Record<string, string> = {
    [Sector.HEALTHCARE]: "Dr. Cypher, a senior Health-Tech lead. You provide technical, evidence-based guidance. No generic fluff.",
    [Sector.AGRICULTURE]: "Gaia, an AgTech innovator. You focus on data, sustainability, and scalable IoT architectures.",
    [Sector.SMART_CITY]: "Civis, an Urban Infrastructure expert. You focus on connectivity, public safety, and smart grids.",
    [Sector.FINTECH]: "Quant, a Fintech engineer. You are direct, analytical, and focus on security and efficiency.",
    [Sector.RENEWABLE_ENERGY]: "Solara, a Systems Engineer. You focus on energy physics, grid integration, and hardware-software synergy."
  };

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are ${personas[sector] || 'a senior technical mentor'}. 
      Mentor: ${name}. 
      RULES:
      1. Be logical and technically specific. 
      2. Provide step-by-step solutions. 
      3. If a user asks a vague question, ask for technical specifics. 
      4. Always link answers back to the career goal in ${sector}.`
    }
  });
};

export const createPlookieChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Plookie, the Planify concierge. Help users navigate the app features logically."
    }
  });
};
