import { Component, output, signal, input, inject, effect, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSend, LucidePaperclip, LucidePackage, LucideX, LucideFile, LucideVideo } from '@lucide/angular';
import { SendMessageCommand, AttachmentSelection, AttachmentSource } from '../../../../../core/services/messaging.types';
import { DraftMessageService } from '../../../../../core/services/draft-message.service';
import { AttachSheetComponent } from '../../../../../shared/components/attach-sheet/attach-sheet';
import { AttachmentPreviewService } from '../../../../../core/services/attachment-preview.service';
import { AttachmentValidatorService } from '../../../../../core/services/attachment-validator.service';

interface ComposerAttachment {
  id: string;
  source: AttachmentSource;
  file: File;
  previewUrl: string;
  kind: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
}

import { Button } from '../../../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [FormsModule, LucideSend, LucidePaperclip, LucidePackage, LucideX, LucideFile, LucideVideo, AttachSheetComponent, Button],
  templateUrl: './message-composer.html',
  styleUrl: './message-composer.css',
})
export class MessageComposer implements OnDestroy {
  conversationId = input<string | undefined>();
  send = output<SendMessageCommand>();
  content = signal('');
  showAttachSheet = signal(false);

  #draftStore = inject(DraftMessageService);
  #previewService = inject(AttachmentPreviewService);
  #validator = inject(AttachmentValidatorService);

  draftEmbeds = signal<{ embedType: string; targetId: string }[]>([]);
  attachments = signal<ComposerAttachment[]>([]);

  constructor() {
    effect(() => {
      const cid = this.conversationId();
      this.#draftStore.draftsChange();

      if (cid) {
        const draft = this.#draftStore.getDraft(cid);
        this.draftEmbeds.set(draft ? draft.embeds : []);
      } else {
        this.draftEmbeds.set([]);
      }
    });
  }

  onAttachmentSelected(selection: AttachmentSelection) {
    const current = this.attachments();
    const result = this.#validator.validateAttachments(current.length, selection.files);
    if (!result.valid) {
      alert(result.error); // Basic error handling, can be improved
      return;
    }

    const newAttachments: ComposerAttachment[] = selection.files.map(file => {
      const id = `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const previewUrl = this.#previewService.createPreview(id, file);
      
      let kind: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' = 'FILE';
      if (file.type.startsWith('image/')) kind = 'IMAGE';
      else if (file.type.startsWith('video/')) kind = 'VIDEO';
      else if (file.type.startsWith('audio/')) kind = 'AUDIO';

      return { id, source: selection.source, file, previewUrl, kind };
    });

    this.attachments.update(a => [...a, ...newAttachments]);
  }

  removeEmbed(targetId: string): void {
    const cid = this.conversationId();
    if (cid) {
      this.#draftStore.removeEmbed(cid, targetId);
    }
  }

  removeAttachment(id: string): void {
    this.#previewService.revokePreview(id);
    this.attachments.update(a => a.filter(att => att.id !== id));
  }

  onSend(): void {
    const val = this.content().trim();
    const embeds = this.draftEmbeds();
    const atts = this.attachments();

    if (!val && embeds.length === 0 && atts.length === 0) return;

    // Group files back into AttachmentSelection[] by source
    const attachmentSelections: AttachmentSelection[] = [];
    const sourceMap = new Map<string, File[]>();
    
    for (const att of atts) {
      if (!sourceMap.has(att.source)) sourceMap.set(att.source, []);
      sourceMap.get(att.source)!.push(att.file);
    }
    
    for (const [source, files] of sourceMap.entries()) {
      attachmentSelections.push({ source: source as any, files });
    }

    this.send.emit({ content: val, embeds, attachments: attachmentSelections.length > 0 ? attachmentSelections : undefined });
    this.content.set(''); // clear input
    
    // Revoke previews since we're done with them in the composer
    for (const att of atts) {
      this.#previewService.revokePreview(att.id);
    }
    this.attachments.set([]);
  }

  clearDrafts(): void {
    const cid = this.conversationId();
    if (cid) {
      this.#draftStore.clearDraft(cid);
    }
  }
  
  ngOnDestroy() {
    for (const att of this.attachments()) {
      this.#previewService.revokePreview(att.id);
    }
  }
}
