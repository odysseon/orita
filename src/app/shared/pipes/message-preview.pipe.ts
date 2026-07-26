import { Pipe, PipeTransform } from '@angular/core';
import { IMessagePreviewDescriptor } from '../../core/services/messaging.types';

const EMBED_LABELS: Record<string, string> = {
  BUSINESS: 'Shared a business',
  LISTING: 'Shared a listing',
  LOCATION: 'Shared a location',
  TOUR: 'Shared a tour',
};

@Pipe({
  name: 'messagePreview',
  standalone: true,
})
export class MessagePreviewPipe implements PipeTransform {
  transform(descriptor: IMessagePreviewDescriptor | undefined | null): string {
    if (!descriptor) return 'Sent a message';

    switch (descriptor.kind) {
      case 'TEXT':
        return descriptor.text || 'Sent a message';
      case 'EMBED':
        return EMBED_LABELS[descriptor.embedType] ?? 'Shared an item';
      case 'ATTACHMENT':
        return descriptor.attachmentType === 'VIDEO' ? 'Sent a video' : 'Sent a photo';
      case 'SYSTEM':
        return descriptor.text || '';
      default:
        return 'Sent a message';
    }
  }
}
