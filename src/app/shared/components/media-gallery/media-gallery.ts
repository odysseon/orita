import { Component, input, output, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideVideo, LucideFile } from '@lucide/angular';
import { MediaGalleryItem, MediaViewerItem } from '../media-viewer/media-viewer.types';
import { MediaGalleryLayoutService, GalleryLayout } from './media-gallery-layout.service';
import { AttachmentPreviewService } from '../../../core/services/attachment-preview.service';
import { MediaViewerComponent } from '../media-viewer/media-viewer';

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  imports: [NgClass, LucideVideo, LucideFile, MediaViewerComponent],
  templateUrl: './media-gallery.html',
  styleUrl: './media-gallery.css'
})
export class MediaGalleryComponent {
  items = input.required<MediaGalleryItem[]>();
  
  #layoutService = inject(MediaGalleryLayoutService);
  #previewService = inject(AttachmentPreviewService);

  layout = computed<GalleryLayout>(() => this.#layoutService.calculateLayout(this.items().length));
  
  visibleItems = computed(() => this.items().slice(0, this.layout().visibleItems));

  // State for MediaViewer
  isViewerOpen = false;
  viewerItems: MediaViewerItem[] = [];
  viewerInitialIndex = 0;

  openViewer(index: number) {
    // Map Gallery items to Viewer items
    this.viewerItems = this.items().map(item => ({
      id: item.id,
      url: item.previewUrl,
      kind: item.kind,
      thumbnailUrl: item.thumbnailUrl,
      alt: item.alt
    }));
    this.viewerInitialIndex = index;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.isViewerOpen = false;
  }
}
