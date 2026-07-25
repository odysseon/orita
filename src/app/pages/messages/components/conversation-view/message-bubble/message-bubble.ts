import { Component, input, output, signal, effect, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideCheckCheck, LucideClock, LucideAlertCircle } from '@lucide/angular';
import { IMessage } from '../../../../../core/services/messaging.types';
import { MediaGalleryComponent } from '../../../../../shared/components/media-gallery/media-gallery';
import { MediaGalleryItem } from '../../../../../shared/components/media-viewer/media-viewer.types';
import { AttachmentPreviewService } from '../../../../../core/services/attachment-preview.service';

import { Button } from '../../../../../shared/ui/atoms/button/button';
import { Avatar } from '../../../../../shared/ui/atoms/avatar/avatar';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [DatePipe, RouterLink, LucideCheck, LucideCheckCheck, LucideClock, LucideAlertCircle, MediaGalleryComponent, Button, Avatar],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css'
})
export class MessageBubble {
  message = input.required<IMessage>();
  isMine = input<boolean>(false);

  retry = output<void>();
  discard = output<void>();

  #previewService = inject(AttachmentPreviewService);
  
  galleryItems = signal<MediaGalleryItem[]>([]);

  constructor() {
    effect(async () => {
      const msg = this.message();
      const views = msg.attachmentViews || [];
      const serverAttachments = msg.attachments || [];
      const legacyUrl = msg.mediaUrl;
      
      const newItems: MediaGalleryItem[] = [];
      
      if (views.length > 0) {
        for (const view of views) {
          const previewUrl = await this.#previewService.resolvePreviewUrl(view.localBlobId, view.remoteUrl);
          if (previewUrl) {
            newItems.push({
              id: view.id,
              previewUrl,
              kind: view.kind,
              alt: 'Attachment'
            });
          }
        }
      } else if (serverAttachments.length > 0) {
        for (const att of serverAttachments) {
          newItems.push({
            id: att.id,
            previewUrl: att.url,
            kind: att.mediaType,
            alt: 'Attachment'
          });
        }
      } else if (legacyUrl) {
        // Fallback for legacy single-attachment messages
        newItems.push({
          id: `legacy-${msg.id}`,
          previewUrl: legacyUrl,
          kind: msg.mediaType || 'IMAGE',
          alt: 'Attachment'
        });
      }
      
      this.galleryItems.set(newItems);
    }, { allowSignalWrites: true });
  }
}
