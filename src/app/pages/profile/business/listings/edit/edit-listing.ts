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
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AppFormField } from '../../../../../shared/form-field/form-field';
import { CategoryService, ICategoryAttribute } from '../../../../../core/services/category.service';

interface IMedia {
  id: string;
  url: string;
  role: 'COVER' | 'GALLERY';
}

@Component({
  selector: 'app-edit-listing',
  imports: [ReactiveFormsModule, AppFormField, LucideTrash2, LucideSave, LucideImagePlus, LucideX],
  templateUrl: './edit-listing.html',
  styleUrl: './edit-listing.css',
})
export class EditListing implements OnInit {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #categoryService = inject(CategoryService);

  #fb = inject(FormBuilder);

  readonly listingId = signal<string>('');
  readonly listing = signal<IListing | null>(null);
  readonly categories = signal<ICategory[]>([]);
  readonly attributes = signal<ICategoryAttribute[]>([]);

  // Media State
  readonly coverMedia = signal<IMedia | null>(null);
  readonly galleryMedia = signal<IMedia[]>([]);

  // Form State
  readonly editForm = this.#fb.group({
    title: [''],
    description: [''],
    categoryId: [''],
    minPrice: this.#fb.control<number | null>(null),
    maxPrice: this.#fb.control<number | null>(null),
    isNegotiable: [false],
    attributesData: this.#fb.record<any>({}),
  });

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
      const cats = await firstValueFrom(
        this.#http.get<ICategory[]>(`${environment.apiUrl}/categories`),
      );
      this.categories.set(cats);

      const l = await firstValueFrom(
        this.#http.get<IListing>(`${environment.apiUrl}/listings/mine/${this.listingId()}`),
      );
      this.listing.set(l);

      this.editForm.patchValue({
        title: l.title,
        description: l.description || '',
        categoryId: l.categoryId || '',
        minPrice: l.minPrice ? Number(l.minPrice) : null,
        maxPrice: l.maxPrice ? Number(l.maxPrice) : null,
        isNegotiable: l.isNegotiable,
      });

      const attrsData = l.attributes || {};
      const attributesRecord = this.editForm.controls.attributesData;
      Object.keys(attrsData).forEach((k) => {
        attributesRecord.addControl(k, this.#fb.control(attrsData[k]));
      });

      const mediaRes = await firstValueFrom(
        this.#http.get<{ cover?: IMedia; gallery: IMedia[] }>(
          `${environment.apiUrl}/listings/${this.listingId()}/media`,
        ),
      );
      this.coverMedia.set(mediaRes.cover || null);
      this.galleryMedia.set(mediaRes.gallery || []);

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
    if (catId) {
      const attrs = await this.#categoryService.getCategoryAttributes(catId);
      this.attributes.set(attrs);
      const attributesRecord = this.editForm.controls.attributesData;
      attrs.forEach((attr) => {
        if (!attributesRecord.contains(attr.key)) {
          attributesRecord.addControl(attr.key, this.#fb.control(''));
        }
      });
    } else {
      this.attributes.set([]);
    }
  }

  async onCategoryChange() {
    const catId = this.editForm.value.categoryId || '';
    this.editForm.setControl('attributesData', this.#fb.record<any>({}));
    await this.loadCategoryAttributes(catId);
  }

  async saveChanges() {
    if (this.editForm.invalid) return;
    this.isSaving.set(true);
    try {
      const val = this.editForm.value;
      const payload = {
        title: val.title,
        description: val.description,
        categoryId: val.categoryId,
        price: {
          minPrice: val.minPrice,
          maxPrice: val.maxPrice,
          isNegotiable: val.isNegotiable,
          currencyCode: 'NGN',
        },
        attributes: val.attributesData,
      };

      await firstValueFrom(
        this.#http.patch(`${environment.apiUrl}/listings/${this.listingId()}`, payload),
      );
      this.#toast.success('Done', 'Listing updated successfully.');
    } catch (err) {
      this.#toast.error('Error', 'Could not update listing.');
    } finally {
      this.isSaving.set(false);
    }
  }

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
      const res = await firstValueFrom(
        this.#http.post<IMedia>(
          `${environment.apiUrl}/listings/${this.listingId()}/media`,
          formData,
        ),
      );
      if (role === 'COVER') {
        this.coverMedia.set(res);
      } else {
        this.galleryMedia.update((g) => [...g, res]);
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
        this.galleryMedia.update((g) => g.filter((m) => m.id !== mediaId));
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
