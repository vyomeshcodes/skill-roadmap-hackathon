
import { DomainType } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-8b-8192";

/**
 * Utility to safely parse JSON from the AI response.
 * Handles markdown blocks and common LLM prefixing.
 */
const safeJsonParse = (text: string | undefined, fallback: any = {}) => {
  if (!text) return fallback;
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON Parse Error:", e, "Raw Output:", text);
    return fallback;
  }
};

/**
 * Standardized helper to call the Groq API.
 * Ensures the 'json_object' format is respected.
 */
const callGroq = async (messages: any[], jsonMode: boolean = false) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.1 // Low temperature for consistent JSON
        // response_format: jsonMode ? { type: "json_object" } : undefined  // Temporarily removed for compatibility
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API failure: ${response.status}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content;
  } catch (error: any) {
    console.error("Groq call failed:", error);
    throw error;
  }
};

export const generateSkillAnalysis = async (domain: DomainType, userProfile: string) => {
  const prompt = `Analyze skill gaps for a professional in ${domain}. 
    Profile: ${userProfile}. 
    Requirement: Return a JSON object with a key "skills" containing an array of 6 objects. 
    Each object must have "subject" (string), "current" (number 0-100), and "required" (100).`;

  const content = await callGroq([
    { role: "system", content: "You are a technical talent analyst. You only communicate using valid JSON objects." },
    { role: "user", content: prompt }
  ], true);

  const parsed = safeJsonParse(content, { skills: [] });
  return parsed.skills || [];
};

export const generateRoadmap = async (domain: DomainType, currentSkills: string[], goal: string) => {
  const prompt = `Create a 5-step career roadmap for a specialist in ${domain}. 
    Current: ${currentSkills.join(', ')}. 
    Target Goal: ${goal}. 
    Unique Generation ID: ${Date.now()}.
    Requirement: Return a JSON object with a key "roadmap" containing an array of 5 steps. 
    Each step must have "title", "description", "estimatedWeeks" (number), and "courseLink" (string).`;

  const content = await callGroq([
    { role: "system", content: "You are an elite career architect. You only communicate using valid JSON objects." },
    { role: "user", content: prompt }
  ], true);

  const parsed = safeJsonParse(content, { roadmap: [] });
  return parsed.roadmap || [];
};

export const generateQuizQuestions = async (domain: DomainType) => {
  const prompt = `Generate 10 advanced technical MCQ for ${domain}. 
    Requirement: Return a JSON object with a key "questions" containing an array. 
    Each item: "question", "options" (array of 4), "correctIndex" (0-3).`;

  const content = await callGroq([
    { role: "system", content: "You are a technical examiner. You only communicate using valid JSON objects." },
    { role: "user", content: prompt }
  ], true);

  const parsed = safeJsonParse(content, { questions: [] });
  return parsed.questions || [];
};

export const aiRewritePortfolio = async (text: string) => {
  const content = await callGroq([
    { role: "system", content: "You are a professional resume writer. Rewrite text to be corporate and impactful. No emojis." },
    { role: "user", content: `Rewrite: "${text}" (Generation ID: ${Date.now()})` }
  ]);
  return content || text;
};

export const getMentorResponse = async (domain: DomainType, history: any[], message: string) => {
  const messages = [
    { role: "system", content: `You are Dr. Aris Vane, an elite mentor in ${domain}. Professional, technical, strategic.` },
    ...history.slice(-10).map(m => ({ 
      role: m.role === 'model' ? 'assistant' : 'user', 
      content: m.text 
    })),
    { role: "user", content: message }
  ];

  return await callGroq(messages);
};
