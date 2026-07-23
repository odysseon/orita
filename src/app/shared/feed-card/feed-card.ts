import {
  Component,
  input,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideImage, LucideMessageCircle } from '@lucide/angular';
import { FeedItemView } from '../../core/services/feed.service';
import { ToastService } from '../../core/services/toast';
import { ShareButton } from '../share-button/share-button';
import { SaveButton, SaveItemType } from '../save-button/save-button';
import { FollowButton } from '../follow-button/follow-button';
import { MessagingFacade } from '../../core/services/messaging.facade';

import { Avatar } from '../ui/atoms/avatar/avatar';

@Component({
  selector: 'app-feed-card',
  imports: [RouterLink, LucideImage, ShareButton, SaveButton, FollowButton, LucideMessageCircle, Avatar],
  templateUrl: './feed-card.html',
  styleUrl: './feed-card.css',
})
export class AppFeedCard implements AfterViewInit, OnDestroy {
  readonly item = input.required<FeedItemView>();

  #toast = inject(ToastService);
  #messagingFacade = inject(MessagingFacade);
  #observer: IntersectionObserver | null = null;

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.item().itemType === 'TOUR' && this.videoElement) {
      this.#observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.videoElement?.nativeElement.play().catch(() => {});
            } else {
              this.videoElement?.nativeElement.pause();
            }
          });
        },
        { threshold: 0.6 },
      );
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

  get shareUrl(): string {
    const item = this.item();
    const base = 'https://orita.onrender.com';
    switch (item.itemType) {
      case 'TOUR':
        return `${base}/tours/${item.tour?.id}`;
      case 'LISTING':
        return `${base}/l/${item.listing?.slug}`;
      case 'BUSINESS':
        return `${base}/b/${item.business?.slug}`;
      default:
        return base;
    }
  }

  get shareTitle(): string {
    const item = this.item();
    switch (item.itemType) {
      case 'TOUR':
        return item.tour?.title || 'Tour';
      case 'LISTING':
        return item.listing?.title || 'Listing';
      case 'BUSINESS':
        return item.business?.name || 'Business';
      default:
        return 'Orita';
    }
  }

  get shareText(): string {
    const item = this.item();
    switch (item.itemType) {
      case 'TOUR':
        return item.tour?.summary || '';
      case 'LISTING':
        return item.listing?.description || '';
      case 'BUSINESS':
        return item.business?.description || '';
      default:
        return '';
    }
  }

  get saveItemType(): SaveItemType {
    const type = this.item().itemType;
    if (type === 'TOUR' || type === 'LISTING' || type === 'BUSINESS') {
      return type as SaveItemType;
    }
    return 'LISTING'; // fallback
  }

  get saveItemId(): string {
    const item = this.item();
    switch (item.itemType) {
      case 'TOUR':
        return item.tour?.id || '';
      case 'LISTING':
        return item.listing?.id || '';
      case 'BUSINESS':
        return item.business?.id || '';
      default:
        return '';
    }
  }

  onMessage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const targetId = this.item().business?.id || this.item().businessProfileId;
    if (!targetId) {
      this.#toast.error('Unable to find business profile');
      return;
    }

    const embedType = this.item().itemType;
    this.#messagingFacade.messageBusiness(targetId, {
      embedType,
      targetId: this.saveItemId
    });
  }
}
