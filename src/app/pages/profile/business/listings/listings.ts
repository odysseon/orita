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

import { AppFormField } from '../../../../shared/form-field/form-field';
import { Drawer } from '../../../../shared/drawer/drawer';
import { CompletionNudge } from '../../../../shared/completion-nudge/completion-nudge';

@Component({
  selector: 'app-listings',
  imports: [
    AppFormField,
    Drawer,
    FormField,
    RouterLink,
    LucidePlus,
    LucidePackage,
    LucideTrash2,
    LucideEye,
    LucideEyeOff,
    LucideLoaderCircle,
    LucidePencil,
    CompletionNudge,
  ],
  templateUrl: './listings.html',
  styleUrl: './listings.css',
})
export class Listings {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #router = inject(Router);

  readonly businessId = input.required<string>();

  readonly showForm = signal(false);
  readonly submitting = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly togglingId = signal<string | null>(null);

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
    categoryId: '',
  });

  readonly createForm = form(this.model, (f) => {
    required(f.title, { message: 'Title is required' });
    minLength(f.title, 2, { message: 'Title must be at least 2 characters' });
    maxLength(f.title, 200, { message: 'Title must be under 200 characters' });
    required(f.categoryId, { message: 'Category is required' });
  });

  readonly isFormInvalid = computed(() => this.createForm().invalid());

  openForm(): void {
    this.model.set({ title: '', categoryId: '' });
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

  async createListing(event: Event): Promise<void> {
    event.preventDefault();
    if (this.createForm().invalid()) return;
    this.submitting.set(true);
    try {
      const m = this.model();
      const payload: Record<string, unknown> = {
        title: m.title,
        categoryId: m.categoryId,
      };
      const createdListing = await firstValueFrom(
        this.#http.post<IListing>(`${environment.apiUrl}/businesses/${this.businessId()}/listings`, payload),
      );
      this.#toast.success('Done', 'Listing created.');
      this.closeForm();
      this.listings.reload();
      // Remove automatic navigation to let user see success state quickly
      // this.#router.navigate(['/profile/business/listings', createdListing.id, 'edit']);
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
}
