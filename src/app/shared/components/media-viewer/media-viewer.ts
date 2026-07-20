import { Component, input, output, signal, HostListener, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideX, LucideChevronLeft, LucideChevronRight, LucideDownload } from '@lucide/angular';
import { MediaViewerItem } from './media-viewer.types';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [CommonModule, LucideX, LucideChevronLeft, LucideChevronRight, LucideDownload],
  templateUrl: './media-viewer.html',
  styleUrl: './media-viewer.css'
})
export class MediaViewerComponent {
  items = input.required<MediaViewerItem[]>();
  initialIndex = input<number>(0);
  close = output<void>();

  currentIndex = signal(0);
  preloadRadius = 1;

  // Zoom state
  scale = signal(1);
  translateX = signal(0);
  translateY = signal(0);
  
  // Touch state for swipe and pinch-to-zoom
  private touchStartX = 0;
  private touchStartY = 0;
  private initialDistance = 0;
  isSwiping = false;

  constructor() {
    effect(() => {
      // Set initial index only once when it changes
      this.currentIndex.set(this.initialIndex());
    }, { allowSignalWrites: true });
  }

  activeItem = computed(() => this.items()[this.currentIndex()]);
  
  hasPrev = computed(() => this.currentIndex() > 0);
  hasNext = computed(() => this.currentIndex() < this.items().length - 1);

  // Preloading logic
  shouldPreload(index: number) {
    return Math.abs(this.currentIndex() - index) <= this.preloadRadius;
  }

  next() {
    if (this.hasNext()) {
      this.resetZoom();
      this.currentIndex.update(i => i + 1);
    }
  }

  prev() {
    if (this.hasPrev()) {
      this.resetZoom();
      this.currentIndex.update(i => i - 1);
    }
  }

  onClose() {
    this.close.emit();
  }

  resetZoom() {
    this.scale.set(1);
    this.translateX.set(0);
    this.translateY.set(0);
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.onClose();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }

  // Simple touch swipe and pinch to zoom
  onTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.isSwiping = this.scale() === 1; // Only swipe if not zoomed
    } else if (e.touches.length === 2) {
      this.isSwiping = false;
      this.initialDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }

  onTouchMove(e: TouchEvent) {
    if (e.touches.length === 1 && this.isSwiping) {
      // Swipe logic can go here (visual feedback)
    } else if (e.touches.length === 2) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.max(1, Math.min(3, this.scale() * (currentDistance / this.initialDistance)));
      this.scale.set(newScale);
      this.initialDistance = currentDistance; // Update for continuous pinch
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (this.isSwiping && e.changedTouches.length === 1) {
      const diffX = this.touchStartX - e.changedTouches[0].clientX;
      if (diffX > 50) this.next();
      else if (diffX < -50) this.prev();
    }
    
    // Reset zoom if it got too small
    if (this.scale() < 1.1) {
      this.resetZoom();
    }
  }

  // Double tap to zoom
  private lastTap = 0;
  onTap(e: Event) {
    const now = Date.now();
    if (now - this.lastTap < 300) {
      // Double tap
      if (this.scale() > 1) {
        this.resetZoom();
      } else {
        this.scale.set(2);
      }
    }
    this.lastTap = now;
  }
}
