export interface ChatMessage {
    id?: number;
    message: string;
    role: 'user' | 'assistant';
    timestamp?: string;
}

export interface ChatResponse {
    response: string;
    timestamp: string;
    role: string;
}
