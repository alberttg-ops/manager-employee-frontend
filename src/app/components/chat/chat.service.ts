import { Injectable } from '@angular/core';

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

  private socket: WebSocket | null = null;

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
      console.log("Message received:", event.data);
      const data = JSON.parse(event.data);
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

    if (!this.socket) {
      console.error("Socket not initialized");
      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not open");
      return;
    }

    this.socket.send(JSON.stringify({
      type: "message",
      content
    }));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
