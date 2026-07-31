import { Component, input, model, output, signal, inject, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';
import { LucideMapPin } from '@lucide/angular';
import { Drawer } from '../../overlays/drawer/drawer';

import { LocationGpsButton } from '../../molecules/location-gps-button/location-gps-button';
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '../../molecules/combobox';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { InputDirective } from '../../atoms/forms';
import { Button } from '../../atoms/button/button';
import { LocationService, Location } from '../../../../core/services/location.service';
import { FollowService } from '../../../../core/services/follow.service';
import { FollowButton } from '../../actions/follow-button/follow-button';

@Component({
  selector: 'ui-location-picker',
  imports: [
    Drawer, LocationGpsButton, LucideMapPin, FollowButton, Button, 
    Combobox, ComboboxInput, ComboboxList, ComboboxOption, SearchBar, InputDirective
  ],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css',
})
export class LocationPicker {
  readonly open = model<boolean>(false);
  readonly triggerLabel = input<string>('Set Location');
  readonly currentAddress = input<string>();
  readonly id = input<string>();

  readonly displayAddress = computed(() => {
    const addr = this.currentAddress();
    if (!addr) return this.triggerLabel();
    const parts = addr.split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0 && !/^\d+$/.test(p));
    if (parts.length <= 2) {
      return parts.join(', ');
    }
    return parts.slice(0, 2).join(', ');
  });

  readonly confirmed = output<Location>();

  readonly provisional = signal<Location | null>(null);
  readonly provisionalIsFollowed = signal<boolean>(false);
  
  readonly searchQuery = signal('');
  readonly isSearching = signal(false);

  #locationService = inject(LocationService);
  #followService = inject(FollowService);

  readonly searchResults = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query.trim()) {
          this.isSearching.set(false);
          return of([]);
        }
        this.isSearching.set(true);
        return this.#locationService.search(query).pipe(
          tap(() => this.isSearching.set(false))
        );
      })
    ),
    { initialValue: [] }
  );

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  async onProvisionalPick(loc: Location): Promise<void> {
    this.provisional.set(loc);
    // When a location is picked, we don't necessarily want to clear the search query, 
    // but the selection handles the provisional state update.
    
    if (!loc.id) {
      this.provisionalIsFollowed.set(false);
      return;
    }
    try {
      const status = await firstValueFrom(this.#followService.getStatus('location', loc.id));
      this.provisionalIsFollowed.set(status.following);
    } catch {
      this.provisionalIsFollowed.set(false);
    }
  }

  confirm(): void {
    const loc = this.provisional();
    if (!loc) return;
    this.confirmed.emit(loc);
    this.provisional.set(null);
    this.open.set(false);
  }

  cancel(): void {
    this.provisional.set(null);
    this.provisionalIsFollowed.set(false);
    this.open.set(false);
  }

  onDismissed(): void {
    this.provisional.set(null);
    this.provisionalIsFollowed.set(false);
  }

  async toggleProvisionalFollow(): Promise<void> {
    const loc = this.provisional();
    if (!loc?.id) return;
    const current = this.provisionalIsFollowed();
    try {
      if (current) {
        await firstValueFrom(this.#followService.unfollow('location', loc.id));
      } else {
        await firstValueFrom(this.#followService.follow('location', loc.id));
      }
      this.provisionalIsFollowed.set(!current);
    } catch {
      // ignore
    }
  }
}
