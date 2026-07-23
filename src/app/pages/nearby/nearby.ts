import { Component, inject, OnInit, OnDestroy, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiscoveryService } from '../../core/services/discovery.service';
import { LocationService } from '../../core/services/location.service';
import { ToastService } from '../../core/services/toast';
import { NearbyItemDto } from '../../core/models/discovery';
import { Subject, timer, Subscription, switchMap, filter, of, Observable } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { NearbyItemCard } from './components/nearby-item-card/nearby-item-card';
import { NewPostSheet } from './components/new-post-sheet/new-post-sheet';
import { AppHeader } from '../../shared/app-header/app-header';
import { Button } from '../../shared/ui/atoms/button/button';
import { AppGrid } from '../../shared/grid/grid';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-nearby',
  standalone: true,
  imports: [CommonModule, RouterModule, NearbyItemCard, NewPostSheet, AppHeader, AppGrid, EmptyState, ScrollHideDirective, LucideMapPin],
  templateUrl: './nearby.html',
  styleUrls: ['./nearby.css'],
})
export class NearbyPage implements OnInit, OnDestroy {
  #discovery = inject(DiscoveryService);
  #location = inject(LocationService);
  #toast = inject(ToastService);

  items = signal<NearbyItemDto[]>([]);
  loading = signal(true);
  error = signal<{title: string; message: string} | null>(null);

  #destroy$ = new Subject<void>();
  #refreshTrigger$ = new Subject<void>();
  #timerSub?: Subscription;

  #currentLat?: number;
  #currentLng?: number;
  #cursorId?: string;
  #cursorScore?: number;
  hasMore = signal(false);
  showNewPostSheet = signal(false);

  #platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.#platformId)) {
      this.#setupRefreshTriggers();
    }
    this.refresh();
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
    this.#timerSub?.unsubscribe();
    if (isPlatformBrowser(this.#platformId)) {
      document.removeEventListener('visibilitychange', this.#onVisibilityChange);
    }
  }

  #setupRefreshTriggers() {
    this.#timerSub = timer(300000, 300000).subscribe(() => {
      this.refresh(false);
    });

    document.addEventListener('visibilitychange', this.#onVisibilityChange);

    this.#refreshTrigger$.pipe(
      debounceTime(500),
      switchMap(() => this.#fetchLocation()),
      filter(loc => !!loc),
      switchMap(loc => this.#fetchData(loc!, this.items().length === 0))
    ).subscribe();
  }

  #onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.refresh(false);
    }
  };

  async refresh(hard = true) {
    if (hard) {
      this.loading.set(true);
      this.items.set([]);
      this.#cursorId = undefined;
      this.#cursorScore = undefined;
    }
    this.#refreshTrigger$.next();
  }

  loadMore() {
    if (!this.hasMore() || this.loading() || !this.#currentLat || !this.#currentLng) return;
    
    this.loading.set(true);
    this.#fetchData({ lat: this.#currentLat, lng: this.#currentLng }, false).subscribe();
  }

  openNewPostSheet() {
    this.showNewPostSheet.set(true);
  }

  #fetchLocation(): Observable<{lat: number, lng: number} | null> {
    return new Observable(obs => {
      this.#location.getCurrentPosition()
        .then(pos => {
          this.#toast.success('Location', 'Location access successful.');
          this.#currentLat = pos.coords.latitude;
          this.#currentLng = pos.coords.longitude;
          obs.next({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          obs.complete();
        })
        .catch(err => {
          const message = err instanceof Error ? err.message : 'Location access denied.';
          this.#toast.error('Location Error', message);
          this.error.set({
            title: 'Location Required',
            message: 'Location access is required to discover nearby opportunities.'
          });
          this.loading.set(false);
          obs.next(null);
          obs.complete();
        });
    });
  }

  #fetchData(loc: {lat: number, lng: number}, isReset = false) {
    const limit = 20;
    return this.#discovery.getNearby({
      lat: loc.lat,
      lng: loc.lng,
      limit,
      cursorId: isReset ? undefined : this.#cursorId,
      cursorScore: isReset ? undefined : this.#cursorScore
    }).pipe(
      tap(res => {
        if (isReset) {
          this.items.set(res.items);
        } else {
          this.items.update(prev => {
            // Filter out items already in the list
            const existingIds = new Set(prev.map(i => i.id));
            return [...prev, ...res.items.filter(i => !existingIds.has(i.id))];
          });
        }
        this.#cursorId = res.cursorId;
        this.#cursorScore = res.cursorScore;
        this.hasMore.set(res.hasMore);
        this.loading.set(false);
        this.error.set(null);
      }),
      catchError(err => {
        this.error.set({
          title: 'Couldn\'t load nearby activity',
          message: 'Failed to load nearby items. Please try again later.'
        });
        this.loading.set(false);
        return of(null);
      })
    );
  }
}
