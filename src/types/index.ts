export interface AgentConfig {
  name: string;
  role_type: 'sales' | 'support' | 'general';
  model: 'gemini-pro' | 'gemini-flash';
  system_prompt: string;
  temperature: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface ChatResponse {
  reply: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
