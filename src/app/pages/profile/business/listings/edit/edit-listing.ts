import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  LucideArrowLeft,
  LucideTrash2,
  LucideSave,
  LucideImagePlus,
  LucideX,
} from '@lucide/angular';
import { environment } from '../../../../../../environments/environment';
import { ToastService } from '../../../../../core/services/toast';
import { IListing, ICategory } from '../listing.interface';
import { FormsModule } from '@angular/forms';
import { AppFormField } from '../../../../../shared/form-field/form-field';

interface ICategoryAttribute {
  id: string;
  key: string;
  label: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  isRequired: boolean;
  options: string[] | null;
}

interface IMedia {
  id: string;
  url: string;
  role: 'COVER' | 'GALLERY';
}

@Component({
  selector: 'app-edit-listing',
  imports: [
    RouterLink,
    FormsModule,
    AppFormField,
    LucideArrowLeft,
    LucideTrash2,
    LucideSave,
    LucideImagePlus,
    LucideX,
  ],
  templateUrl: './edit-listing.html',
  styleUrl: './edit-listing.css',
})
export class EditListing implements OnInit {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  readonly listingId = signal<string>('');
  readonly listing = signal<IListing | null>(null);
  readonly categories = signal<ICategory[]>([]);
  readonly attributes = signal<ICategoryAttribute[]>([]);
  
  // Media State
  readonly coverMedia = signal<IMedia | null>(null);
  readonly galleryMedia = signal<IMedia[]>([]);
  
  // Form State
  readonly title = signal('');
  readonly description = signal('');
  readonly categoryId = signal('');
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly isNegotiable = signal(false);
  
  // Dynamic Attributes State
  readonly attributesData = signal<Record<string, any>>({});

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isUploadingCover = signal(false);
  readonly isUploadingGallery = signal(false);

  ngOnInit() {
    this.listingId.set(this.#route.snapshot.paramMap.get('listingId') ?? '');
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // 1. Fetch Categories
      const cats = await firstValueFrom(this.#http.get<ICategory[]>(`${environment.apiUrl}/categories`));
      this.categories.set(cats);

      // 2. Fetch Listing
      const l = await firstValueFrom(this.#http.get<IListing>(`${environment.apiUrl}/listings/mine/${this.listingId()}`));
      this.listing.set(l);
      
      // Initialize form fields
      this.title.set(l.title);
      this.description.set(l.description || '');
      this.categoryId.set(l.categoryId || '');
      this.minPrice.set(l.minPrice ? Number(l.minPrice) : null);
      this.maxPrice.set(l.maxPrice ? Number(l.maxPrice) : null);
      this.isNegotiable.set(l.isNegotiable);
      this.attributesData.set(l.attributes || {});

      // 3. Fetch Listing Media
      const mediaRes = await firstValueFrom(this.#http.get<{ cover?: IMedia, gallery: IMedia[] }>(`${environment.apiUrl}/listings/${this.listingId()}/media`));
      this.coverMedia.set(mediaRes.cover || null);
      this.galleryMedia.set(mediaRes.gallery || []);

      // 4. Fetch Category Attributes if categoryId exists
      if (l.categoryId) {
        await this.loadCategoryAttributes(l.categoryId);
      }

    } catch (err) {
      this.#toast.error('Error', 'Could not load listing details.');
      this.#router.navigate(['../'], { relativeTo: this.#route });
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadCategoryAttributes(catId: string) {
    const cats = this.categories();
    let slug = '';
    
    // Find category slug
    for (const root of cats) {
      if (root.id === catId) slug = root.slug;
      for (const child of root.children || []) {
        if (child.id === catId) slug = child.slug;
      }
    }

    if (slug) {
      try {
        const attrs = await firstValueFrom(this.#http.get<ICategoryAttribute[]>(`${environment.apiUrl}/categories/${slug}/attributes`));
        this.attributes.set(attrs);
      } catch {
        this.attributes.set([]);
      }
    }
  }

  async onCategoryChange() {
    // If category changes, attributes might change, clear the data
    this.attributesData.set({});
    await this.loadCategoryAttributes(this.categoryId());
  }

  async saveChanges() {
    this.isSaving.set(true);
    try {
      const payload = {
        title: this.title(),
        description: this.description(),
        categoryId: this.categoryId(),
        price: {
          minPrice: this.minPrice(),
          maxPrice: this.maxPrice(),
          isNegotiable: this.isNegotiable(),
          currencyCode: 'NGN'
        },
        attributes: this.attributesData()
      };
      
      await firstValueFrom(this.#http.patch(`${environment.apiUrl}/listings/${this.listingId()}`, payload));
      this.#toast.success('Done', 'Listing updated successfully.');
    } catch (err) {
      this.#toast.error('Error', 'Could not update listing.');
    } finally {
      this.isSaving.set(false);
    }
  }

  // Media Handlers
  async onCoverUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.isUploadingCover.set(true);
    await this.uploadMedia(file, 'COVER');
    this.isUploadingCover.set(false);
  }

  async onGalleryUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    this.isUploadingGallery.set(true);
    // Upload sequentially to avoid overwhelming the server, or in parallel
    for (let i = 0; i < files.length; i++) {
      await this.uploadMedia(files[i], 'GALLERY');
    }
    this.isUploadingGallery.set(false);
  }

  private async uploadMedia(file: File, role: 'COVER' | 'GALLERY') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    try {
      const res = await firstValueFrom(this.#http.post<IMedia>(`${environment.apiUrl}/listings/${this.listingId()}/media`, formData));
      if (role === 'COVER') {
        this.coverMedia.set(res);
      } else {
        this.galleryMedia.update(g => [...g, res]);
      }
    } catch (err) {
      this.#toast.error('Error', 'Could not upload image.');
    }
  }

  async deleteMedia(mediaId: string, role: 'COVER' | 'GALLERY') {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await firstValueFrom(this.#http.delete(`${environment.apiUrl}/media/${mediaId}`));
      if (role === 'COVER') {
        this.coverMedia.set(null);
      } else {
        this.galleryMedia.update(g => g.filter(m => m.id !== mediaId));
      }
      this.#toast.success('Done', 'Image deleted.');
    } catch (err) {
      this.#toast.error('Error', 'Could not delete image.');
    }
  }

  get leafCategories() {
    const cats = this.categories() ?? [];
    return cats.flatMap((root) => root.children.filter((child) => child.isActive));
  }
}
