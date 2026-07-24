import { Component, computed, inject, signal, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LucideMapPin,
} from '@lucide/angular';
import { BusinessCard } from '../../shared/ui/organisms/cards/business-card/business-card';
import { ListingCard } from '../../shared/ui/organisms/cards/listing-card/listing-card';
import { StoreTourCard } from '../../shared/ui/organisms/cards/store-tour-card/store-tour-card';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { RootHeader } from '../../shared/ui/organisms/root-header/root-header';
import { LocationPicker } from '../../shared/ui/organisms/location-picker/location-picker';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { AppGrid } from '../../shared/grid/grid';
import { FeedService, FeedItemView } from '../../core/services/feed.service';
import { ToastService } from '../../core/services/toast';
import { SeoComponent } from '../../shared/seo/seo.component';
import { ExplorationService } from '../../core/services/exploration.service';
import { Skeleton } from '../../shared/ui/atoms/skeleton/skeleton';
import { Button } from '../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    BusinessCard,
    ListingCard,
    StoreTourCard,
    EmptyState,
    RootHeader,
    LocationPicker,
    ScrollHideDirective,
    AppGrid,
    SeoComponent,
    LucideMapPin,
    Skeleton, Button,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  #feedService = inject(FeedService);
  #toast = inject(ToastService);
  #exploration = inject(ExplorationService);
  #router = inject(Router);

  readonly feedItems = signal<FeedItemView[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(true);

  readonly activeLocation = this.#exploration.activeLocation;

  setLocation(result: any) {
    const context = {
      id: `geo_${result.latitude}_${result.longitude}`,
      name: result.formattedAddress || result.name,
      city: null,
      state: null,
      country: null,
      lat: result.latitude,
      lng: result.longitude,
    };
    this.#exploration.setLocation(context);
  }

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
    // Auto-reload when location changes
    effect((onCleanup) => {
      this.#exploration.activeLocation(); // subscribe to changes
      
      const sub = this.loadInitialFeed();
      onCleanup(() => sub.unsubscribe());
    });
  }

  readonly seoConfig = {
    title: 'Home',
    description: 'Local discovery platform connecting people with businesses, services, and opportunities around them.',
  };

  loadInitialFeed() {
    this.isLoading.set(true);
    const loc = this.#exploration.activeLocation();
    return this.#feedService.getFeed({ limit: 15, lat: loc?.lat, lng: loc?.lng }).subscribe({
      next: (items) => {
        this.feedItems.set(items);
        this.hasMore.set(items.length === 15);
        this.isLoading.set(false);
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse && err.status === 400) {
          this.#toast.info('Location Required', 'Please select a location to explore.');
          this.#exploration.isLocationPickerOpen.set(true);
        } else {
          this.#toast.error('Failed to load feed');
        }
        this.isLoading.set(false);
      }
    });
  }

  loadMore() {
    if (this.isLoadingMore() || !this.hasMore()) return;

    const currentItems = this.feedItems();
    const lastItem = currentItems[currentItems.length - 1];
    if (!lastItem) return;

    const loc = this.#exploration.activeLocation();
    this.isLoadingMore.set(true);
    this.#feedService.getFeed({ 
      limit: 15, 
      cursorScore: lastItem.score, 
      cursorId: lastItem.id,
      lat: loc?.lat,
      lng: loc?.lng
    }).subscribe({
      next: (newItems) => {
        this.feedItems.update(items => [...items, ...newItems]);
        this.hasMore.set(newItems.length === 15);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse && err.status === 400) {
          this.#toast.info('Location Required', 'Please select a location to explore.');
          this.#exploration.isLocationPickerOpen.set(true);
        } else {
          this.#toast.error('Failed to load more items');
        }
        this.isLoadingMore.set(false);
      }
    });
  }
}
