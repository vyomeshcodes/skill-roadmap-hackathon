
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DomainType } from "../types";

// Initialize GoogleGenAI only if an API key is provided.
const API_KEY = process.env.API_KEY;
let ai: any = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn('GoogleGenAI API key is missing. Using local fallbacks for AI calls.');
}

export const generateSkillAnalysis = async (domain: DomainType, userProfile: string) => {
  if (!ai) {
    // Fallback mock analysis when API key isn't available (e.g., running in browser)
    return {
      skills: [
        { subject: 'Core Concepts', current: 45, required: 100 },
        { subject: 'Platform Tooling', current: 40, required: 100 },
        { subject: 'Domain Algorithms', current: 35, required: 100 },
        { subject: 'Data Handling', current: 50, required: 100 },
        { subject: 'Deployment', current: 30, required: 100 },
        { subject: 'Security & Compliance', current: 25, required: 100 }
      ]
    } as any;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the skill gap for a professional in ${domain}. 
      Current profile: ${userProfile}. 
      Return a JSON object with a list of 6 skills, each having 'subject', 'current' (0-100), 'required' (100 for all).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                current: { type: Type.NUMBER },
                required: { type: Type.NUMBER }
              },
              required: ['subject', 'current', 'required']
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateRoadmap = async (domain: DomainType, currentSkills: string[], goal: string) => {
  // Use gemini-3-pro-preview for high-reasoning tasks like roadmap architecture
  if (!ai) {
    // Return a deterministic fallback roadmap for client-side usage without secrets
    return [
      { title: 'Foundation & Concepts', description: `Understand core ${domain} concepts and tools.`, estimatedWeeks: 4, courseLink: 'https://www.coursera.org/' },
      { title: 'Tooling & Workflows', description: 'Hands-on use of common platform tools and pipelines.', estimatedWeeks: 6, courseLink: 'https://www.udemy.com/' },
      { title: 'Applied Projects', description: 'Build sector-specific projects to apply learning.', estimatedWeeks: 8, courseLink: 'https://www.edx.org/' },
      { title: 'Architectural Patterns', description: 'Learn scalable system design patterns for the domain.', estimatedWeeks: 6, courseLink: 'https://www.coursera.org/' },
      { title: 'Portfolio & Network', description: 'Polish portfolio, publish projects, and engage with mentors.', estimatedWeeks: 4, courseLink: 'https://www.linkedin.com/learning/' }
    ];
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a senior career architect in ${domain}. A specialist has these skills: ${currentSkills.join(', ')}. 
      Goal: ${goal}. 
      1. Identify missing technical skills for this specific domain.
      2. Provide REAL, current, and active redirectable course links (Coursera/Udemy/edX).
      3. Return a JSON array of 5 steps, each with 'title', 'description', 'estimatedWeeks', and 'courseLink'.`,
    config: {
      tools: [{ googleSearch: {} }], // Grounding for real course links
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedWeeks: { type: Type.NUMBER },
            courseLink: { type: Type.STRING }
          },
          required: ['title', 'description', 'estimatedWeeks', 'courseLink']
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateQuizQuestions = async (domain: DomainType) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 10 advanced technical multiple-choice questions for ${domain}. 
      Return a JSON array where each item has 'question', 'options' (array of 4 strings), and 'correctIndex' (number 0-3).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER }
          },
          required: ['question', 'options', 'correctIndex']
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const aiRewritePortfolio = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this portfolio section professionally and corporately: "${text}". No emojis.`,
  });
  return response.text;
};

export const getMentorResponse = async (domain: DomainType, history: any[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are an elite mentor in ${domain}. Tone: Professional, technical, concise. No bold characters.`
    }
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};
