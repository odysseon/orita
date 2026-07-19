import { Component, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserSearchService } from '../../core/services/user-search.service.js';
import { UserSearchResult } from '../../core/types/share.types.js';

import { Avatar } from '../ui/avatar/avatar';
import { LucideSearch, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-people-search',
  standalone: true,
  imports: [CommonModule, Avatar, LucideSearch, LucideX],
  templateUrl: './people-search.html',
  styleUrl: './people-search.css',
})
export class PeopleSearchComponent {
  #searchService = inject(UserSearchService);

  query = signal<string>('');
  results = signal<UserSearchResult[]>([]);
  isLoading = signal<boolean>(false);

  selected = output<UserSearchResult>();

  constructor() {
    toObservable(this.query)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((q) => {
          if (q.trim()) {
            this.isLoading.set(true);
          } else {
            this.isLoading.set(false);
            this.results.set([]);
          }
        }),
        switchMap((q) => {
          if (!q.trim()) return of({ items: [] });
          return this.#searchService.search(q).pipe(
            catchError(() => of({ items: [] }))
          );
        }),
        tap((res: any) => {
          this.results.set(res.items);
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  selectUser(user: UserSearchResult) {
    this.selected.emit(user);
    // Clear search after selection
    this.query.set('');
    this.results.set([]);
  }
}
