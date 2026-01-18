
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DomainType } from "../types";

// Initialize GoogleGenAI strictly using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSkillAnalysis = async (domain: DomainType, userProfile: string) => {
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
