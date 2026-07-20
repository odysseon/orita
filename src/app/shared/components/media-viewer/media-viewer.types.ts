export interface MediaViewerItem {
  id: string;
  url: string;
  kind: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
  thumbnailUrl?: string;
  alt?: string;
}

export interface MediaGalleryItem {
  id: string;
  previewUrl: string;
  kind: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
  thumbnailUrl?: string;
  alt?: string;
}
