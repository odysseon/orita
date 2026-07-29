import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import {
  ShareService,
  RecentShareableDto,
  ShareableSearchResult,
} from '../../../../../core/services/share.service';
import { SaveService } from '../../../../../core/services/save.service';
import { FollowService } from '../../../../../core/services/follow.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchBar } from '../../../molecules/search-bar/search-bar';
import {
  List,
  ListItem,
  ListItemStart,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemEnd,
} from '../../../surfaces/list/list';
import { ListingSearchResult } from '../../search-results/listing-search-result/listing-search-result';
import { CheckboxDirective, InputDirective } from '../../../atoms/forms';
import { LucideStore, LucideImage, LucideMapPin } from '@lucide/angular';

export interface AttachSheetOritaItemSelected {
  type: string;
  targetId: string;
}

@Component({
  selector: 'ui-attach-sheet-orita-tab',
  standalone: true,
  imports: [
    SearchBar,
    List,
    ListItem,
    ListItemStart,
    ListItemContent,
    ListItemTitle,
    ListItemDescription,
    ListItemEnd,
    ListingSearchResult,
    CheckboxDirective,
    InputDirective,
    LucideStore,
    LucideImage,
    LucideMapPin,
  ],
  templateUrl: './attach-sheet-orita-tab.html',
  styleUrl: './attach-sheet-orita-tab.css',
})
export class AttachSheetOritaTab implements OnInit {
  isOpen = input<boolean>(false);

  itemSelected = output<AttachSheetOritaItemSelected>();

  #shareService = inject(ShareService);
  #saveService = inject(SaveService);
  #followService = inject(FollowService);

  searchQuery = signal('');
  searchQuery$ = new Subject<string>();
  searchResults = signal<ShareableSearchResult[]>([]);
  isSearching = signal(false);

  recent = signal<RecentShareableDto[]>([]);
  savedItems = signal<any[]>([]);
  followingItems = signal<any[]>([]);

  ngOnInit() {
    this.searchQuery$.pipe(debounceTime(250), distinctUntilChanged()).subscribe((query) => {
      this.performSearch(query);
    });
  }

  load(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.loadRecent();
    this.loadLibrary();
  }

  async loadRecent() {
    try {
      const recs = await this.#shareService.getRecentShares();
      this.recent.set(recs);
    } catch (e) {
      console.error('Failed to load recent shares', e);
    }
  }

  async loadLibrary() {
    try {
      this.#saveService.getSavedItems({ limit: 5 }).subscribe((res: any) => {
        this.savedItems.set(res?.items || []);
      });
      this.#followService.getFollowing({ limit: 5 }).subscribe((res: any) => {
        this.followingItems.set(Array.isArray(res) ? res : res?.items || []);
      });
    } catch (e) {
      console.error('Failed to load library items', e);
    }
  }

  onSearchInput(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchQuery.set(q);
    this.searchQuery$.next(q);
  }

  onClearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearching.set(false);
  }

  async performSearch(query: string) {
    if (!query.trim()) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }
    this.isSearching.set(true);
    try {
      const results = await this.#shareService.searchShareables(query);
      this.searchResults.set(results);
    } catch (err) {
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  selectItem(type: string, targetId: string): void {
    this.itemSelected.emit({ type, targetId });
  }
}
