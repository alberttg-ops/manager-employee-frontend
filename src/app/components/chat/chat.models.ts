export interface ChatMessage {
  sender_id: string;
  content: string;
  timestamp: string;
  conversation_id?: string;
}
