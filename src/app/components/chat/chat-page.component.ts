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
})
export class ChatPageComponent implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private authState = inject(AuthStateService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  targetUserId!: string;
  currentUserId!: string;
  currentConversationId!: string;


  messages: ChatMessage[] = [];
  newMessage = "";

  async ngOnInit() {

  this.route.paramMap.subscribe(async params => {

    const user = this.authState.user();

    if (!user) {
      console.error("User not loaded yet");
      return;
    }

    this.currentUserId = user.id;
    this.targetUserId = params.get('id')!;

    this.messages = [];
    this.chatService.disconnect();

    const token = await this.authState.getAccessToken();

    // this.chatService.connect(
    //   this.targetUserId,
    //   token,
    //   (msg) => this.messages.push(msg)
    // );
    
//     this.chatService.connect(
//   this.targetUserId,
//   token,
//   (msg) => {
//     this.zone.run(() => {
//       this.messages.push(msg);
//     });
//   }
// );
this.chatService.connect(
  this.targetUserId,
  token,
  (msg) => {
    if (msg.conversation_id === this.currentConversationId) {
  this.messages = [...this.messages, msg];
    this.cdr.detectChanges();

}

  }
);


  this.currentConversationId = [
  this.currentUserId,
  this.targetUserId
].sort().join('::');


  });
}


//   send() {

//   if (!this.newMessage) return;

//   const optimisticMessage = {
//     type: "message",
//     conversation_id: "",
//     sender_id: this.currentUserId,
//     receiver_id: this.targetUserId,
//     content: this.newMessage,
//     timestamp: new Date().toISOString()
//   };

//   this.messages.push(optimisticMessage);

//   this.chatService.sendMessage(this.newMessage);

//   this.newMessage = "";
// }
send() {
  if (!this.newMessage) return;

  this.chatService.sendMessage(this.newMessage);
  this.newMessage = "";
  console.log("send triggered");
}

// send() {
//   const message = this.newMessage;
//   this.newMessage = "";

//   setTimeout(() => {
//     this.chatService.sendMessage(message);
//   });
// }



  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
