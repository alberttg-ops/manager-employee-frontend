import { Component, OnDestroy, OnInit, inject , NgZone , ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService, ChatMessage } from './chat.service';
import { AuthStateService } from '../../services/auth-state.service';


@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})export class ChatPageComponent implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private authState = inject(AuthStateService);
  private cdr = inject(ChangeDetectorRef);

  messages: ChatMessage[] = [];
  newMessage = '';

  currentUserId!: string;
  targetUserId!: string;
  currentConversationId!: string;

  async ngOnInit() {

    // Get logged in user email
    this.currentUserId = this.authState.user()?.id!;

    // Get target from route
    this.targetUserId = this.route.snapshot.paramMap.get('id')!;

    // Build deterministic conversation id
    this.currentConversationId = [
      this.currentUserId,
      this.targetUserId
    ].sort().join('::');

    // 1️⃣ Load history FIRST
    this.chatService.getHistory(this.targetUserId)
      .subscribe((history: ChatMessage[]) => {

        this.messages = history.map(msg => ({
          type: 'message',
          conversation_id: this.currentConversationId,
          sender_id: msg.sender_id,
          receiver_id: '',
          content: msg.content,
          timestamp: msg.timestamp
        }));

        this.cdr.detectChanges();
      });

    // 2️⃣ Then connect websocket
    const token = await this.authState.getAccessToken(); // use your real method

    this.chatService.connect(
      this.targetUserId,
      token,
      (msg: ChatMessage) => {

        // Only append if correct conversation
        if (msg.conversation_id === this.currentConversationId) {
          this.messages = [...this.messages, msg];
          this.cdr.detectChanges();
        }
      }
    );
  }

  send() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
