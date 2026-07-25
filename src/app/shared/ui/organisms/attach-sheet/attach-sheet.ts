import { Component, input, signal, inject, OnInit, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ShareService,
  RecentShareableDto,
  ShareableSearchResult,
} from '../../../../core/services/share.service';
import { DraftMessageService } from '../../../../core/services/draft-message.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AttachmentSelection } from '../../../../core/services/messaging.types';
import { Drawer } from '../../overlays/drawer/drawer';
import { Tabs, TabList, TabTrigger } from '../../molecules/tabs';
import { Button } from '../../atoms/button/button';
import { List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd } from '../../surfaces/list/list';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { ListingSearchResult } from '../search-results/listing-search-result/listing-search-result';
import { InputDirective, CheckboxDirective } from '../../atoms/forms';
import {
  LucideSearch,
  LucidePackage,
  LucideStore,
  LucideImage,
  LucideMapPin,
  LucideCamera,
  LucideFileImage,
} from '@lucide/angular';
import { SaveService } from '../../../../core/services/save.service';
import { FollowService } from '../../../../core/services/follow.service';

@Component({
  selector: 'ui-attach-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Drawer,
    Tabs, TabList, TabTrigger, Button,
    List, ListItem, ListItemStart, ListItemContent, ListItemTitle, ListItemDescription, ListItemEnd,
    SearchBar,
    ListingSearchResult,
    InputDirective, CheckboxDirective,
    LucideSearch,
    LucidePackage,
    LucideStore,
    LucideImage,
    LucideMapPin,
    LucideCamera,
    LucideFileImage,
  ],
  templateUrl: './attach-sheet.html',
  styleUrl: './attach-sheet.css',
})
export class AttachSheetComponent implements OnInit {
  isOpen = input<boolean>(false);
  conversationId = input<string | undefined>();

  close = output<void>();
  attachmentSelected = output<AttachmentSelection>();

  #shareService = inject(ShareService);
  #draftStore = inject(DraftMessageService);
  #saveService = inject(SaveService);
  #followService = inject(FollowService);

  activeTab = signal<'ORITA' | 'MEDIA'>('ORITA');
  recent = signal<RecentShareableDto[]>([]);

  searchQuery = signal('');
  searchQuery$ = new Subject<string>();
  searchResults = signal<ShareableSearchResult[]>([]);
  isSearching = signal(false);

  savedItems = signal<any[]>([]);
  followingItems = signal<any[]>([]);

  ngOnInit() {
    this.searchQuery$.pipe(debounceTime(250), distinctUntilChanged()).subscribe((query) => {
      this.performSearch(query);
    });
  }

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.activeTab.set('ORITA');
        this.searchQuery.set('');
        this.searchResults.set([]);
        this.loadRecent();
        this.loadLibrary();
      }
    });
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

  onTabChanged(val: string | undefined) {
    if (val === 'ORITA' || val === 'MEDIA') {
      this.activeTab.set(val);
    }
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
    const cid = this.conversationId();
    if (!cid) {
      return;
    }

    this.#draftStore.attachEmbed(cid, {
      embedType: type as any,
      targetId: targetId,
    });
    this.onDrawerClose();
  }

  handleFileSelected(event: Event, source: 'CAMERA' | 'GALLERY' | 'FILES') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.attachmentSelected.emit({ source, files });
      this.onDrawerClose();
    }
  }

  onDrawerClose() {
    this.close.emit();
  }
}
