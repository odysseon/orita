import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideMapPin,
} from '@lucide/angular';
import { AppFeedCard } from '../../shared/feed-card/feed-card';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { AppHeader } from '../../shared/app-header/app-header';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { AppGrid } from '../../shared/grid/grid';
import { FeedService, FeedItemView } from '../../core/services/feed.service';
import { ToastService } from '../../core/services/toast';
import { SeoComponent } from '../../shared/seo/seo.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AppFeedCard,
    EmptyState,
    AppHeader,
    ScrollHideDirective,
    AppGrid,
    SeoComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  #feedService = inject(FeedService);
  #toast = inject(ToastService);

  readonly feedItems = signal<FeedItemView[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(true);

  // Grouped editorial sections for the view
  readonly editorialSections = computed(() => {
    const items = this.feedItems();
    if (items.length === 0) return [];

    // Simple grouping logic: every 5 items creates a section
    // In a real app, this could be driven by backend flags
    const groups: { title?: string; items: FeedItemView[] }[] = [];
    const titles = ["Just Opened Nearby", "Fresh Listings", "Popular This Week", "Explore Your Neighborhood"];
    let titleIndex = 0;

    for (let i = 0; i < items.length; i += 5) {
      const slice = items.slice(i, i + 5);
      if (i === 0) {
        groups.push({ items: slice }); // First group has no header, just raw feed
      } else {
        groups.push({ title: titles[titleIndex % titles.length], items: slice });
        titleIndex++;
      }
    }
    return groups;
  });

  constructor() {
    this.loadInitialFeed();
  }

  readonly seoConfig = {
    title: 'Home',
    description: 'Local discovery platform connecting people with businesses, services, and opportunities around them.',
  };

  loadInitialFeed() {
    this.isLoading.set(true);
    this.#feedService.getFeed({ limit: 15 }).subscribe({
      next: (items) => {
        this.feedItems.set(items);
        this.hasMore.set(items.length === 15);
        this.isLoading.set(false);
      },
      error: () => {
        this.#toast.error('Failed to load feed');
        this.isLoading.set(false);
      }
    });
  }

  loadMore() {
    if (this.isLoadingMore() || !this.hasMore()) return;

    const currentItems = this.feedItems();
    const lastItem = currentItems[currentItems.length - 1];
    if (!lastItem) return;

    this.isLoadingMore.set(true);
    this.#feedService.getFeed({ 
      limit: 15, 
      cursorScore: lastItem.score, 
      cursorId: lastItem.id 
    }).subscribe({
      next: (newItems) => {
        this.feedItems.update(items => [...items, ...newItems]);
        this.hasMore.set(newItems.length === 15);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.#toast.error('Failed to load more items');
        this.isLoadingMore.set(false);
      }
    });
  }
}
