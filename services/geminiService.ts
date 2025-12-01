
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { ExamConfig, GeneratedExam, Question, QuestionType, UploadedFile, Difficulty } from "../types";

const SYSTEM_INSTRUCTION = `You are 'Study.AI', an elite, high-performance academic assessment engine. 
Your directive is to analyze source material with extreme depth and generate unique, rigorous exam content.
NEVER generate generic or repetitive questions. 
Every execution must yield a fresh perspective, focusing on different nuances, details, or conceptual links within the text.

Output Rules:
1. STRICT JSON format matching the schema.
2. Questions must be unambiguous but intellectually stimulating.
3. For 'MCQ', options must be highly plausible distractors, avoiding obvious wrong answers.
4. For 'MATCHING', ensure relationships are non-trivial.
5. For 'LONG_ANSWER' and 'ESSAY', prompts must require synthesis, critical thinking, and evidence from the source.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          notes: { type: Type.STRING },
          pairs: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                 left: {type: Type.STRING}, 
                 right: {type: Type.STRING} 
              } 
            } 
          }
        },
        required: ["id", "type", "question", "difficulty"]
      }
    }
  }
};

// Strategies to force the AI to look at the content differently each time
const ANALYSIS_STRATEGIES = [
  "Focus on cause-and-effect relationships and underlying logic.",
  "Focus on practical applications and real-world scenarios.",
  "Focus on critical analysis, comparing and contrasting key concepts.",
  "Focus on minute details, definitions, and specific terminology.",
  "Focus on high-level synthesis and broad thematic connections.",
  "Focus on controversial or complex aspects of the text.",
  "Focus on chronological or process-oriented sequences."
];

export const generateExamContent = async (
  files: UploadedFile[],
  config: ExamConfig
): Promise<GeneratedExam> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-2.5-flash';

  const parts = [];

  // Add Files
  for (const file of files) {
    parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }

  // Select a random strategy to ensure variety
  const strategy = ANALYSIS_STRATEGIES[Math.floor(Math.random() * ANALYSIS_STRATEGIES.length)];
  const entropy = Math.random().toString(36).substring(2, 15); // Random seed string

  // Construct Prompt based on Config
  let promptText = `GENERATE A UNIQUE EXAM.
  session_entropy_id: ${entropy} (Do not repeat questions from previous sessions with different IDs).
  
  ANALYSIS VECTOR: ${strategy}
  
  Configuration:
  - Target Difficulty: ${config.difficulty}
  - Specific Focus: ${config.topicFocus || 'Comprehensive coverage'}
  
  Structure Requirements:
  `;

  if (config.mcqCount > 0) promptText += `- ${config.mcqCount} Multiple Choice Questions (Type: MCQ). Options must be challenging.\n`;
  if (config.shortCount > 0) promptText += `- ${config.shortCount} Short Answer Questions (Type: SHORT_ANSWER).\n`;
  if (config.essayCount > 0) promptText += `- ${config.essayCount} Essay Questions (Type: ESSAY). Require deep explanation.\n`;
  if (config.longAnswerCount > 0) promptText += `- ${config.longAnswerCount} Detailed Long Answer Questions (Type: LONG_ANSWER).\n`;
  if (config.tfCount > 0) promptText += `- ${config.tfCount} True/False Questions (Type: TRUE_FALSE). Focus on common misconceptions.\n`;
  if (config.fillCount > 0) promptText += `- ${config.fillCount} Fill in the Blank Questions (Type: FILL_BLANK).\n`;
  if (config.matchingCount > 0) promptText += `- ${config.matchingCount} Matching Questions (Type: MATCHING). Create 4-5 pairs per question.\n`;

  // Specific Logic for Difficulty Levels
  if (config.difficulty === Difficulty.CONCEPTUAL) {
    promptText += `\nCRITICAL: Disregard surface-level facts. Test deep understanding of *why* and *how*.`;
  } else if (config.difficulty === Difficulty.IMPORTANT) {
    promptText += `\nCRITICAL: Filter content to only include the most vital, high-yield concepts.`;
  } else if (config.difficulty === Difficulty.HARD) {
    promptText += `\nCRITICAL: Create complex, multi-step problems or questions that require connecting disparate facts.`;
  }

  promptText += `\nEnsure the JSON output strictly follows the schema. Generate distinct IDs.`;

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.85, // High temperature for maximum variety and creativity
        topP: 0.95,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response generated");

    const parsed = JSON.parse(jsonText);
    
    return {
      questions: parsed.questions || [],
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const chatWithStudyAI = async (message: string, history: any[]) => {
   const apiKey = process.env.API_KEY;
   if(!apiKey) return "Error: API Key missing.";
   const ai = new GoogleGenAI({ apiKey });
   const chat = ai.chats.create({
     model: 'gemini-2.5-flash',
     history: history,
     config: { 
       systemInstruction: "You are 'Study.AI', a highly advanced autonomous academic assistant. Your responses should be intelligent, precise, and sophisticated. Use **bold text** for key concepts. Adopt a helpful but high-tech, slightly robotic yet professional persona.",
       temperature: 0.7 
     }
   });
   
   const result = await chat.sendMessage({ message });
   return result.text;
};
