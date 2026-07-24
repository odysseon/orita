import { Component, computed, inject, input, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
  LucidePlus,
  LucidePackage,
  LucideTrash2,
  LucideEye,
  LucideEyeOff,
  LucideLoaderCircle,
  LucidePencil,
} from '@lucide/angular';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import { ToastService } from '../../../../core/services/toast';
import { IListing, ICategory, ICreateListing } from './listing.interface';
import { environment } from '../../../../../environments/environment';
import { IBusinessProfile } from '../business.interface';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { Skeleton } from '../../../../shared/ui/atoms/skeleton/skeleton';

import { AppFormField } from '../../../../shared/ui/atoms/form-field/form-field';
import { Drawer } from '../../../../shared/drawer/drawer';
import { CompletionNudge } from '../../../../shared/completion-nudge/completion-nudge';
import { ListingService } from '../../../../core/services/listing.service';
import { PublicationIssue } from '../../../../core/services/business-profile.service';
import { PublicationReadinessDialog } from '../../../../shared/publication-readiness/publication-readiness';

@Component({
  selector: 'app-listings',
  imports: [FormField, 
    AppFormField,
    Drawer,
    AppFormField,
    RouterLink,
    LucidePlus,
    LucidePackage,
    LucideTrash2,
    LucideEye,
    LucideEyeOff,
    LucideLoaderCircle,
    LucidePencil,
    CompletionNudge,
    PublicationReadinessDialog,
    Button,
    Skeleton,
  ],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #router = inject(Router);
  #listingService = inject(ListingService);

  readonly businessId = input.required<string>();
  readonly businessProfile = input<IBusinessProfile>();

  readonly showForm = signal(false);
  readonly submitting = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly togglingId = signal<string | null>(null);

  readonly isReadinessDialogOpen = signal(false);
  readonly readinessIssues = signal<PublicationIssue[]>([]);

  readonly canCreateListing = computed(() => {
    return !!this.businessProfile()?.primaryCategoryId;
  });

  readonly listings = httpResource<IListing[]>(
    () => `${environment.apiUrl}/businesses/${this.businessId()}/listings/mine`,
  );

  readonly categories = httpResource<ICategory[]>(() => `${environment.apiUrl}/categories`);

  readonly leafCategories = computed<ICategory[]>(() => {
    const cats = this.categories.value() ?? [];
    return cats.flatMap((root) => root.children.filter((child) => child.isActive));
  });

  readonly model = signal<ICreateListing>({
    title: '',
    description: '',
  });

  readonly createForm = form(this.model, (f) => {
    required(f.title, { message: 'Title is required' });
    minLength(f.title, 2, { message: 'Title must be at least 2 characters' });
    maxLength(f.title, 200, { message: 'Title must be under 200 characters' });
    required(f.description, { message: 'Description is required' });
    minLength(f.description, 10, { message: 'Description must be at least 10 characters' });
  });

  readonly isFormInvalid = computed(() => this.createForm().invalid());

  openForm(): void {
    if (!this.canCreateListing()) {
      this.#toast.error('Missing Category', 'Please set a primary category for your business first.');
      return;
    }
    this.model.set({ title: '', description: '' });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  formatPrice(listing: IListing): string {
    if (!listing.minPrice) return listing.isNegotiable ? 'Negotiable' : '—';
    const currency = listing.currencyCode ?? 'NGN';
    const min = Number(listing.minPrice).toLocaleString();
    const max = listing.maxPrice ? Number(listing.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  }

  isListingIncomplete(listing: IListing): boolean {
    return !listing.description || !listing.minPrice;
  }

  navigateToEdit(listingId: string): void {
    this.#router.navigate(['/profile/business/listings', listingId, 'edit']);
  }

  navigateToEditBusiness(): void {
    this.#router.navigate(['/profile/business/edit']);
  }

  async createListing(event: Event): Promise<void> {
    event.preventDefault();
    if (this.createForm().invalid()) {
      this.createForm().markAsTouched();
      return;
    }
    this.submitting.set(true);
    try {
      const m = this.model();
      const payload: Record<string, unknown> = {
        title: m.title,
        description: m.description,
        categoryId: this.businessProfile()?.primaryCategoryId,
      };
      const createdListing = await firstValueFrom(
        this.#http.post<IListing>(`${environment.apiUrl}/businesses/${this.businessId()}/listings`, payload),
      );
      this.#toast.success('Done', 'Listing created.');
      this.closeForm();
      this.listings.reload();
      // Navigate to edit to let user see success state quickly and add photos
      this.navigateToEdit(createdListing.id);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Could not create listing.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
    } finally {
      this.submitting.set(false);
    }
  }

  async toggleStatus(listing: IListing): Promise<void> {
    const next = listing.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    
    if (next === 'PUBLISHED') {
      try {
        const readiness = await this.#listingService.checkReadiness(listing.id);
        if (!readiness.ready) {
          this.readinessIssues.set(readiness.issues);
          this.isReadinessDialogOpen.set(true);
          return;
        }
      } catch (err) {
        this.#toast.error('Error', 'Failed to check listing readiness.');
        return;
      }
    }

    this.togglingId.set(listing.id);
    try {
      await firstValueFrom(
        this.#http.patch(`${environment.apiUrl}/listings/${listing.id}/status`, {
          status: next,
        }),
      );
      this.listings.reload();
    } catch {
      this.#toast.error('Error', 'Could not update listing status.');
    } finally {
      this.togglingId.set(null);
    }
  }

  async deleteListing(listing: IListing): Promise<void> {
    this.deletingId.set(listing.id);
    try {
      await firstValueFrom(this.#http.delete(`${environment.apiUrl}/listings/${listing.id}`));
      this.#toast.success('Done', 'Listing deleted.');
      this.listings.reload();
    } catch {
      this.#toast.error('Error', 'Could not delete listing.');
    } finally {
      this.deletingId.set(null);
    }
  }

  closeReadinessDialog(): void {
    this.isReadinessDialogOpen.set(false);
  }
}
