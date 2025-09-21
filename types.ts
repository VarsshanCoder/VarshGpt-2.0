export enum Model {
  GEMINI = 'Gemini',
  OPENAI = 'OpenAI',
  DEEPSEEK = 'DeepSeek',
}

export enum Mode {
  APTITUDE = 'Aptitude',
  CODING = 'Coding',
  DOCUMENT = 'Document',
  IMAGE = 'Image',
  SEARCH = 'Search',
  AGENT = 'Agent',
}

export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export interface MessageSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isError?: boolean;
  imageUrl?: string;
  sources?: MessageSource[];
}

export interface Chat {
  id:string;
  title: string;
  messages: Message[];
  mode: Mode;
  model: Model;
  createdAt: number;
}

export type Theme = 'light' | 'dark';

export interface AppSettings {
  openai: string;
  deepseek: string;
  openaiEndpoint?: string;
  deepseekEndpoint?: string;
  userProfile?: string;
}