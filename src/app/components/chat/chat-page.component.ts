import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService, ChatMessage } from './chat.service';
import { AuthStateService } from '../../services/auth-state.service';

import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private authState = inject(AuthStateService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';

  currentUserId!: string;
  targetUserId!: string;
  currentConversationId!: string;

  async ngOnInit() {

    this.currentUserId = this.authState.user()?.id!;
    this.targetUserId = this.route.snapshot.paramMap.get('id')!;

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

        // 🔥 Scroll AFTER DOM renders
        setTimeout(() => this.scrollToBottom(), 0);
      });

    // 2️⃣ Then connect websocket
    const token = await this.authState.getAccessToken();

    this.chatService.connect(
      this.targetUserId,
      token,
      (msg: ChatMessage) => {

        if (msg.conversation_id === this.currentConversationId) {
          this.messages = [...this.messages, msg];
          this.cdr.detectChanges();

          // 🔥 Scroll on new message
          setTimeout(() => this.scrollToBottom(), 0);
        }
      }
    );
  }

  private scrollToBottom(): void {
    if (!this.scrollContainer) return;

    const el = this.scrollContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
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
