import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSend, LucidePaperclip } from '@lucide/angular';
import { SendMessageDto } from '../../../../../core/services/messaging.types';

@Component({
  selector: 'app-message-composer',
  imports: [FormsModule, LucideSend, LucidePaperclip],
  templateUrl: './message-composer.html',
  styleUrl: './message-composer.css'
})
export class MessageComposer {
  send = output<SendMessageDto>();
  content = signal('');

  onSend(): void {
    const val = this.content().trim();
    if (!val) return;

    this.send.emit({ content: val });
    this.content.set(''); // clear input
  }
}
