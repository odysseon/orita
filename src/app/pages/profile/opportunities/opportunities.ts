import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { OpportunityService } from '../../../core/services/opportunity.service';
import { NearbyItemDto } from '../../../core/models/discovery';
import { Subject, switchMap, catchError, of, tap, takeUntil } from 'rxjs';
import { PageHeader } from '../../../shared/ui/organisms/page-header/page-header';
import { NearbyItemCard } from '../../nearby/components/nearby-item-card/nearby-item-card';
import { Grid } from '../../../shared/ui/layouts/grid/grid';
import { EmptyState } from '../../../shared/empty-state/empty-state';
import { Skeleton } from '../../../shared/ui/atoms/skeleton/skeleton';
import { Drawer } from '../../../shared/ui/overlays/drawer/drawer';
import { Button } from '../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-my-opportunities',
  imports: [PageHeader, NearbyItemCard, Grid, EmptyState, Skeleton, Drawer, Button],
  templateUrl: './opportunities.html',
  styleUrls: ['./opportunities.css']
})
export class MyOpportunities implements OnInit, OnDestroy {
  #opportunity = inject(OpportunityService);
  
  items = signal<NearbyItemDto[]>([]);
  loading = signal(true);
  error = signal(false);

  showActionSheet = signal(false);
  selectedItem = signal<NearbyItemDto | null>(null);

  #refresh$ = new Subject<void>();
  #destroy$ = new Subject<void>();

  ngOnInit() {
    this.#refresh$.pipe(
      takeUntil(this.#destroy$),
      tap(() => {
        this.loading.set(true);
        this.error.set(false);
      }),
      switchMap(() => this.#opportunity.getMyPosts().pipe(
        catchError(() => {
          this.error.set(true);
          return of([]);
        })
      ))
    ).subscribe(items => {
      this.items.set(items);
      this.loading.set(false);
    });

    this.#refresh$.next();
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  handleActionClick(event: { item: NearbyItemDto, action: 'reply' | 'manage' }) {
    this.selectedItem.set(event.item);
    this.showActionSheet.set(true);
  }

  closeActionSheet() {
    this.showActionSheet.set(false);
    this.selectedItem.set(null);
  }

  getEditTimeRemaining(item: NearbyItemDto | null): string {
    if (!item?.editableUntil) return '';
    const now = new Date().getTime();
    const target = new Date(item.editableUntil).getTime();
    if (!Number.isFinite(target)) return '';
    const diffMs = target - now;
    if (diffMs <= 0) return '(Edit window closed)';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours > 0) {
      return `(Closes in ${diffHours}h ${diffMins}m)`;
    }
    return `(Closes in ${diffMins}m)`;
  }

  completeOpportunity() {
    const item = this.selectedItem();
    if (!item) return;
    this.closeActionSheet();
    
    this.#opportunity.complete(item.id).subscribe({
      next: () => this.#refresh$.next(),
      error: () => {} // handle error
    });
  }

  deleteOpportunity() {
    const item = this.selectedItem();
    if (!item) return;
    this.closeActionSheet();
    
    this.#opportunity.delete(item.id).subscribe({
      next: () => this.#refresh$.next(),
      error: () => {} // handle error
    });
  }
}
