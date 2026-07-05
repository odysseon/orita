import { Component, input, inject, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideImage, LucideMapPin, LucideBookmark, LucideShare2, LucideMessageCircle } from '@lucide/angular';
import { FeedItemView } from '../../core/services/feed.service';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-feed-card',
  imports: [RouterLink, LucideImage, LucideMapPin, LucideBookmark, LucideShare2, LucideMessageCircle],
  templateUrl: './feed-card.html',
  styleUrl: './feed-card.css'
})
export class AppFeedCard implements AfterViewInit, OnDestroy {
  readonly item = input.required<FeedItemView>();
  
  #toast = inject(ToastService);
  #observer: IntersectionObserver | null = null;

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.item().itemType === 'TOUR' && this.videoElement) {
      this.#observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.videoElement?.nativeElement.play().catch(() => {});
          } else {
            this.videoElement?.nativeElement.pause();
          }
        });
      }, { threshold: 0.6 });
      this.#observer.observe(this.videoElement.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.#observer) {
      this.#observer.disconnect();
    }
  }

  get distanceText(): string {
    const d = this.item().distanceMeters;
    if (d < 1000) return `${Math.round(d)}m away`;
    return `${(d / 1000).toFixed(1)}km away`;
  }

  onSave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.#toast.success('Saved for later');
  }

  onShare(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.#toast.success('Link copied to clipboard');
  }

  onMessage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.#toast.info('Messaging coming soon!');
  }
}
