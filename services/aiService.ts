import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { type Message, Mode, Model, Sender, type AppSettings, MessageSource } from '../types';

interface BotResponse {
  text: string;
  imageUrl?: string;
  sources?: MessageSource[];
}

const getSystemInstruction = (mode: Mode, hasFiles: boolean, userProfile?: string): string => {
  const profileInstruction = userProfile ? `---
USER PROFILE: ${userProfile}
---
` : '';

  let coreInstruction = "";
  switch (mode) {
    case Mode.APTITUDE:
      coreInstruction = "You are VarshGpt 2.0, an expert AI assistant specializing in logical reasoning, quantitative aptitude, and mathematical problem-solving. Provide clear, step-by-step explanations. Show your reasoning chain. Use bullet points or numbered lists for clarity. Always aim to make the user smarter, not just give answers.";
      break;
    case Mode.CODING:
      coreInstruction = `You are VarshGpt 2.0, an expert AI coding partner. ${hasFiles ? 'Analyze the provided code file(s), explain them, suggest improvements, and help debug any issues. You can reference multiple files to understand the project context.' : 'Provide clean, commented, production-ready code.'} Analyze time and space complexity. Suggest edge cases and optimizations. Format code snippets properly using markdown code blocks.`;
      break;
    case Mode.DOCUMENT:
      coreInstruction = `You are VarshGpt 2.0, an expert AI assistant for document analysis. ${hasFiles ? 'Analyze the provided file(s), synthesize information across them, summarize key points, and answer any questions based on their content. You can handle multiple files at once.' : 'You can analyze documents. Please upload one or more files to get started.'} Provide concise summaries or detailed explanations as requested.`;
      break;
    case Mode.SEARCH:
      coreInstruction = "You are a helpful AI assistant with access to Google Search. Answer the user's query based on the provided search results. Be concise and accurate. Cite your sources."
      break;
    case Mode.AGENT:
      coreInstruction = "You are VarshGpt 2.0, an autonomous AI agent. When given a complex task, first, create a step-by-step plan formatted in a markdown list. Then, execute that plan. After executing the plan, provide a final, comprehensive, yet concise answer based on your findings."
      break;
    default:
      coreInstruction = "You are a helpful AI assistant.";
      break;
  }
  return profileInstruction + coreInstruction;
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const generateImageResponse = async (prompt: string): Promise<BotResponse> => {
   if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not set. Please configure the `API_KEY` environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
    },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("Image generation failed.");
  }

  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
  
  return { text: '', imageUrl: imageUrl };
}

const generateGeminiChatResponse = async (mode: Mode, history: Message[], files: File[], settings: AppSettings): Promise<BotResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not set. Please configure the `API_KEY` environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = getSystemInstruction(mode, files.length > 0, settings.userProfile);
  
  const lastUserMessage = history[history.length - 1];
  if (!lastUserMessage || lastUserMessage.sender !== Sender.USER) {
    throw new Error("Cannot generate response without a user message.");
  }

  // History for the chat session, excluding the last user message which will be sent separately.
  const chatHistoryForAPI = history.slice(0, -1).map(msg => ({
    role: msg.sender === Sender.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const useSearch = mode === Mode.SEARCH;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: chatHistoryForAPI,
    config: {
      systemInstruction: systemInstruction,
      ...(useSearch && { tools: [{ googleSearch: {} }] }),
    }
  });

  // Prepare the parts for the last user message
  const lastMessageParts: ({text: string} | {inlineData: {data: string, mimeType: string}})[] = [];

  if (files.length > 0) {
    const fileParts = await Promise.all(files.map(file => fileToGenerativePart(file)));
    lastMessageParts.push(...fileParts);
  }
  
  if (lastUserMessage.text) {
      lastMessageParts.push({ text: lastUserMessage.text });
  }

  if (lastMessageParts.length === 0) {
      return { text: "Please provide a message or a file to continue." };
  }

  const response = await chat.sendMessage({ message: lastMessageParts });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'Untitled',
      uri: chunk.web?.uri || '#',
  })) || [];

  return { text: response.text, sources };
};

const generateOpenAIResponse = async (mode: Mode, history: Message[], files: File[], settings: AppSettings): Promise<BotResponse> => {
  const apiKey = settings.openai || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not set. Please add it via settings or configure the `OPENAI_API_KEY` environment variable.");
  }
  if (files.length > 0) {
    throw new Error("File uploads are not supported with the OpenAI model in this app.");
  }
  
  const endpoint = (settings.openaiEndpoint || 'https://api.openai.com/v1').replace(/\/$/, '');
  const url = `${endpoint}/chat/completions`;

  const systemInstruction = getSystemInstruction(mode, false, settings.userProfile);
  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map(msg => ({
      role: msg.sender === Sender.USER ? 'user' : 'assistant',
      content: msg.text
    }))
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o', messages: messages })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("OpenAI API call failed:", error);
    throw new Error(`Failed to get a response from OpenAI. ${error?.error?.message || ''}`);
  }
  const data = await response.json();
  return { text: data.choices[0]?.message?.content || "No response from OpenAI." };
};

const generateDeepSeekResponse = async (mode: Mode, history: Message[], files: File[], settings: AppSettings): Promise<BotResponse> => {
  const apiKey = settings.deepseek || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DeepSeek API key is not set. Please add it via settings or configure the `DEEPSEEK_API_KEY` environment variable.");
  }
  if (files.length > 0) {
    throw new Error("File uploads are not supported with the DeepSeek model in this app.");
  }
  
  const endpoint = (settings.deepseekEndpoint || 'https://api.deepseek.com').replace(/\/$/, '');
  const url = `${endpoint}/chat/completions`;

  const systemInstruction = getSystemInstruction(mode, false, settings.userProfile);
  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map(msg => ({
      role: msg.sender === Sender.USER ? 'user' : 'assistant',
      content: msg.text
    }))
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: messages })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("DeepSeek API call failed:", error);
    throw new Error(`Failed to get a response from DeepSeek. ${error?.error?.message || ''}`);
  }
  const data = await response.json();
  return { text: data.choices[0]?.message?.content || "No response from DeepSeek." };
};

export const generateResponse = async (
  model: Model,
  mode: Mode,
  history: Message[],
  files: File[],
  settings: AppSettings
): Promise<BotResponse> => {

  if (mode === Mode.IMAGE) {
      if (model !== Model.GEMINI) throw new Error("Image generation is only available with the Gemini model.");
      if (files.length > 0) throw new Error("Image generation mode does not support file uploads.");
      const lastMessage = history[history.length - 1];
      return await generateImageResponse(lastMessage.text);
  }

  switch (model) {
    case Model.GEMINI:
      return await generateGeminiChatResponse(mode, history, files, settings);
    case Model.OPENAI:
      return await generateOpenAIResponse(mode, history, files, settings);
    case Model.DEEPSEEK:
      return await generateDeepSeekResponse(mode, history, files, settings);
    default:
      throw new Error("Unsupported model selected.");
  }
};