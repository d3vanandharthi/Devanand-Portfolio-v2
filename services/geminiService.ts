import { GoogleGenAI } from "@google/genai";
import { RESUME_CONTENT } from "../constants";

let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing!");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const streamChatResponse = async function* (
  history: { role: string; text: string }[],
  userMessage: string
) {
  const client = getAIClient();
  const model = "gemini-2.5-flash";

  const systemInstruction = `
    You are an advanced AI Assistant for Devanand Mallesh Harthi's interactive portfolio.
    Your persona is professional, slightly futuristic, and knowledgeable about .NET architecture and Software Engineering.
    
    Here is Devanand's resume data:
    ${RESUME_CONTENT}

    Rules:
    1. Answer questions strictly based on the provided resume context.
    2. If asked about something not in the resume, professionally state that you don't have that information but can discuss his known skills.
    3. Keep answers concise and engaging. 
    4. Emphasize his expertise in .NET, Microservices, and Financial Tech.
    5. Do not hallucinate contact details not provided.
    6. Use formatting (bullet points, bold) to make the text readable.
  `;

  // Format history for the API
  // Note: @google/genai chat history format requires 'parts' array
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const chat = client.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
    history: formattedHistory
  });

  const responseStream = await chat.sendMessageStream({
    message: userMessage
  });

  for await (const chunk of responseStream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};