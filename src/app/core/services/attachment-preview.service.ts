import { Injectable, OnDestroy, inject } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({ providedIn: 'root' })
export class AttachmentPreviewService implements OnDestroy {
  #db = inject(DatabaseService);
  private objectUrls = new Map<string, string>(); // blobId -> objectUrl

  /**
   * Creates an object URL for a File or Blob synchronously.
   */
  createPreview(blobId: string, blob: Blob | File): string {
    if (this.objectUrls.has(blobId)) {
      return this.objectUrls.get(blobId)!;
    }
    const url = URL.createObjectURL(blob);
    this.objectUrls.set(blobId, url);
    return url;
  }

  /**
   * Resolves a preview URL asynchronously, reading from IDB if necessary.
   */
  async resolvePreviewUrl(localBlobId?: string, remoteUrl?: string): Promise<string | null> {
    if (localBlobId) {
      if (this.objectUrls.has(localBlobId)) {
        return this.objectUrls.get(localBlobId)!;
      }
      const pendingAtt = await this.#db.getAttachment(localBlobId);
      if (pendingAtt && pendingAtt.blob) {
        return this.createPreview(localBlobId, pendingAtt.blob);
      }
    }
    return remoteUrl || null;
  }

  getPreview(blobId: string): string | undefined {
    return this.objectUrls.get(blobId);
  }

  revokePreview(blobId: string): void {
    const url = this.objectUrls.get(blobId);
    if (url) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(blobId);
    }
  }

  revokeAllPreviews(): void {
    for (const url of this.objectUrls.values()) {
      URL.revokeObjectURL(url);
    }
    this.objectUrls.clear();
  }

  ngOnDestroy(): void {
    this.revokeAllPreviews();
  }
}
