import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ChatMessage {
  type: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {

  private http = inject(HttpClient);   // ✅ Injected properly
  private socket: WebSocket | null = null;

  getHistory(targetEmail: string) {
    return this.http.get<ChatMessage[]>(
      `http://localhost:5000/api/chat/history/${targetEmail}`
    );
  }

  connect(
    targetUserId: string,
    token: string,
    onMessage: (msg: ChatMessage) => void
  ) {

    const url = `ws://localhost:5000/ws/chat/${targetUserId}?token=${token}`;

    console.log("Connecting to:", url);

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket OPEN");
    };

    this.socket.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      onMessage(data);
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    this.socket.onclose = () => {
      console.log("WebSocket CLOSED");
      this.socket = null;
    };
  }

  sendMessage(content: string) {

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not ready");
      return;
    }

    this.socket.send(JSON.stringify({
      type: "message",
      content
    }));
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}
