import { Component, input, signal, inject, OnInit, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareService, SuggestedShareRecipientDto } from '../../../core/services/share.service';
import { UserSearchService } from '../../../core/services/user-search.service';
import { UserSearchResult } from '../../../core/types/share.types';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Drawer } from '../../drawer/drawer';
import { LucideSearch, LucideCheck, LucideSend, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, Drawer, LucideSearch, LucideCheck, LucideSend, LucideX],
  templateUrl: './share-modal.html',
  styleUrl: './share-modal.css',
})
export class ShareModalComponent implements OnInit {
  isOpen = input<boolean>(false);
  embedType = input.required<'BUSINESS' | 'LISTING' | 'TOUR' | 'LOCATION'>();
  targetId = input.required<string>();
  title = input.required<string>();
  subtitle = input<string>();
  imageUrl = input<string>();

  close = output<void>();

  #shareService = inject(ShareService);
  #userSearchService = inject(UserSearchService);
  #authService = inject(AuthService);

  isAuthenticated = computed(() => !!this.#authService.token());

  suggested = signal<SuggestedShareRecipientDto[]>([]);
  searchResults = signal<UserSearchResult[]>([]);
  isSearching = signal(false);
  
  searchQuery = signal('');
  searchQuery$ = new Subject<string>();

  selectedRecipients = signal<Set<string>>(new Set());
  messageContent = signal('');
  
  isSending = signal(false);
  sendSuccess = signal<string[]>([]);

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.loadSuggested();
    }

    this.searchQuery$.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  async loadSuggested() {
    try {
      const recs = await this.#shareService.getSuggestedRecipients();
      this.suggested.set(recs);
    } catch (e) {
      console.error('Failed to load suggested recipients', e);
    }
  }

  onSearchInput(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchQuery.set(q);
    this.searchQuery$.next(q);
  }

  performSearch(query: string) {
    if (!query.trim()) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }
    this.isSearching.set(true);
    this.#userSearchService.search(query).subscribe({
      next: (res) => {
        this.searchResults.set(res.items);
        this.isSearching.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isSearching.set(false);
      }
    });
  }

  toggleRecipient(userId: string) {
    const current = new Set(this.selectedRecipients());
    if (current.has(userId)) {
      current.delete(userId);
    } else {
      current.add(userId);
    }
    this.selectedRecipients.set(current);
  }

  isSelected(userId: string): boolean {
    return this.selectedRecipients().has(userId);
  }
  
  isSent(userId: string): boolean {
    return this.sendSuccess().includes(userId);
  }

  async onSend() {
    const ids = Array.from(this.selectedRecipients());
    if (ids.length === 0) return;

    this.isSending.set(true);
    try {
      await this.#shareService.shareInternal({
        embedType: this.embedType(),
        targetId: this.targetId(),
        recipientIds: ids,
        content: this.messageContent().trim() || undefined
      });
      const newSuccess = [...this.sendSuccess(), ...ids];
      this.sendSuccess.set(newSuccess);
      this.selectedRecipients.set(new Set());
      this.messageContent.set('');
    } catch (err) {
      console.error('Failed to send share', err);
    } finally {
      this.isSending.set(false);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.selectedRecipients().size > 0) {
      event.preventDefault();
      this.onSend();
    }
  }

  onDrawerClose() {
    this.close.emit();
  }
}
