import { Component, output, signal, input, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSend, LucidePaperclip, LucidePackage, LucideX } from '@lucide/angular';
import { SendMessageDto } from '../../../../../core/services/messaging.types';
import { DraftMessageService } from '../../../../../core/services/draft-message.service';
import { AttachSheetComponent } from '../../../../../shared/components/attach-sheet/attach-sheet';

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [FormsModule, LucideSend, LucidePaperclip, LucidePackage, LucideX, AttachSheetComponent],
  templateUrl: './message-composer.html',
  styleUrl: './message-composer.css',
})
export class MessageComposer {
  conversationId = input<string | undefined>();
  send = output<SendMessageDto>();
  content = signal('');
  showAttachSheet = signal(false);

  #draftStore = inject(DraftMessageService);

  draftEmbeds = signal<{ embedType: string; targetId: string }[]>([]);

  constructor() {
    // Reactively update draftEmbeds when conversationId changes or drafts change
    effect(() => {
      const cid = this.conversationId();
      // subscribe to draftsChange
      this.#draftStore.draftsChange();

      if (cid) {
        const draft = this.#draftStore.getDraft(cid);
        this.draftEmbeds.set(draft ? draft.embeds : []);
      } else {
        this.draftEmbeds.set([]);
      }
    });
  }

  removeEmbed(targetId: string): void {
    const cid = this.conversationId();
    if (cid) {
      this.#draftStore.removeEmbed(cid, targetId);
    }
  }

  onSend(): void {
    const val = this.content().trim();
    const embeds = this.draftEmbeds();

    if (!val && embeds.length === 0) return;

    this.send.emit({ content: val, embeds });
    this.content.set(''); // clear input

    // We clear the draft immediately upon sending for responsive UX,
    // but ideally we'd wait for success. Since our sendMessage emits via
    // the facade/store, we could listen for success, but for simplicity we
    // clear it here. The user said: "clear drafts carefully... I'd clear only after the send succeeds."
    // Wait, the user specifically requested to clear it ONLY after it succeeds.
    // We can emit the event and let the parent clear the draft.
    // The event is `send.emit(...)`. The parent (`MessagesPage`) calls `MessagingRepository.sendMessage`.
    // Wait, `MessagingRepository.sendMessage` does an optimistic update and returns void!
    // Let's modify `MessageComposer` to wait or just clear it here for now?
    // No, I'll clear it when `onSend` happens and it's successful, or let the `MessagesPage` clear it.
    // Actually, I can just not clear it here, and add a method `clearDrafts()` that the parent can call!
  }

  clearDrafts(): void {
    const cid = this.conversationId();
    if (cid) {
      this.#draftStore.clearDraft(cid);
    }
  }
}
