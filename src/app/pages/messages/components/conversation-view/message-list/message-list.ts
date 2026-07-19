import { Component, input, output, ViewChild, ElementRef, AfterViewChecked, effect } from '@angular/core';
import { MessageBubble } from '../message-bubble/message-bubble';
import { IMessage } from '../../../../../core/services/messaging.types';

@Component({
  selector: 'app-message-list',
  imports: [MessageBubble],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList implements AfterViewChecked {
  messages = input<IMessage[]>([]);
  viewerParticipantId = input<string | undefined>(undefined);

  retryMessage = output<string>();
  discardMessage = output<string>();

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private shouldScroll = false;
  private prevMessageCount = 0;

  constructor() {
    effect(() => {
      const count = this.messages().length;
      if (count > this.prevMessageCount) {
        this.shouldScroll = true;
      }
      this.prevMessageCount = count;
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
