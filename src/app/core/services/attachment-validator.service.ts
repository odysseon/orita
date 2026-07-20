import { Injectable } from '@angular/core';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AttachmentValidatorService {
  private readonly MAX_ATTACHMENTS = 10;
  private readonly MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
  private readonly SUPPORTED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'application/pdf',
  ]);

  validateAttachments(currentCount: number, newFiles: File[]): ValidationResult {
    if (currentCount + newFiles.length > this.MAX_ATTACHMENTS) {
      return { valid: false, error: `You can only attach up to ${this.MAX_ATTACHMENTS} files.` };
    }

    for (const file of newFiles) {
      if (file.size > this.MAX_FILE_SIZE_BYTES) {
        return { valid: false, error: `File ${file.name} exceeds the 50MB size limit.` };
      }
      
      // Basic MIME type check. Some OSs might return empty string for unknown types.
      // We do a loose check if it starts with image/, video/, audio/ or is exactly supported.
      if (!this.SUPPORTED_MIME_TYPES.has(file.type)) {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
           return { valid: false, error: `File type ${file.type || 'unknown'} is not supported for ${file.name}.` };
        }
      }
    }

    return { valid: true };
  }
}
