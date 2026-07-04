import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LucideSearch, LucideX, LucideClock } from '@lucide/angular';
import { SearchService, SearchQueryParams } from '../../core/services/search.service';
import { AppListingCard } from '../../shared/listing-card/listing-card';
import { AppBizCard } from '../../shared/biz-card/biz-card';

@Component({
  selector: 'app-search',
  imports: [LucideSearch, LucideX, LucideClock, AppListingCard, AppBizCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  #searchService = inject(SearchService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  readonly queryParamMap = toSignal(this.#route.queryParamMap);

  readonly searchType = computed<'listing' | 'business'>(() => {
    return (this.queryParamMap()?.get('tab') as any) || 'listing';
  });

  readonly searchQuery = computed(() => {
    return this.queryParamMap()?.get('q') || '';
  });

  readonly rawQuery = signal(this.#route.snapshot.queryParamMap.get('q') || '');
  readonly isDebouncing = computed(() => this.rawQuery() !== this.searchQuery());

  readonly recentSearches = signal<string[]>(this.loadRecentSearches());

  readonly listingParams = computed<SearchQueryParams | null>(() => {
    if (this.searchType() !== 'listing' || !this.searchQuery().trim()) return null;
    return { q: this.searchQuery().trim() };
  });

  readonly businessParams = computed<SearchQueryParams | null>(() => {
    if (this.searchType() !== 'business' || !this.searchQuery().trim()) return null;
    return { q: this.searchQuery().trim() };
  });

  readonly listingsResource = this.#searchService.getListingsResource(this.listingParams);
  readonly businessesResource = this.#searchService.getBusinessesResource(this.businessParams);

  constructor() {
    toObservable(this.rawQuery).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(q => {
      this.#router.navigate([], {
        relativeTo: this.#route,
        queryParams: { q: q || null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      if (q && q.trim().length > 0) {
        this.saveRecentSearch(q.trim());
      }
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.rawQuery.set(input.value);
  }

  clearSearch() {
    this.rawQuery.set('');
  }

  setSearchType(type: 'listing' | 'business') {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { tab: type },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  applyRecent(query: string) {
    this.rawQuery.set(query);
  }

  private loadRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem('orita_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveRecentSearch(query: string) {
    try {
      const searches = new Set([query, ...this.loadRecentSearches()]);
      const arr = Array.from(searches).slice(0, 8); // Keep last 8 searches
      localStorage.setItem('orita_recent_searches', JSON.stringify(arr));
      this.recentSearches.set(arr);
    } catch {}
  }
}
