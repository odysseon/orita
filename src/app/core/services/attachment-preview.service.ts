import { Injectable, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AttachmentPreviewService implements OnDestroy {
  private objectUrls = new Map<string, string>(); // blobId -> objectUrl

  /**
   * Creates an object URL for a File or Blob, caches it by a unique identifier,
   * and returns the URL. If one already exists for that identifier, it's returned.
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
   * Retrieves an existing preview URL by blobId, if any.
   */
  getPreview(blobId: string): string | undefined {
    return this.objectUrls.get(blobId);
  }

  /**
   * Revokes the object URL and removes it from the cache.
   */
  revokePreview(blobId: string): void {
    const url = this.objectUrls.get(blobId);
    if (url) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(blobId);
    }
  }

  /**
   * Cleans up all object URLs created by this service.
   */
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
