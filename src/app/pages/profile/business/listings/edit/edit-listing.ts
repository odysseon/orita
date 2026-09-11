import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  LucideSave,
} from '@lucide/angular';
import { MediaSelector } from '../../../../../shared/media-selector/media-selector';
import { environment } from '../../../../../../environments/environment';
import { ToastService } from '../../../../../core/services/toast';
import { MediaService } from '../../../../../core/services/media.service';
import { IListing, ICategory } from '../listing.interface';
import { form, FormField, required } from '@angular/forms/signals';
import { AppFormField } from '@odysseon/ur-ui';
import { CategoryService, ICategoryAttribute } from '../../../../../core/services/category.service';
import { Button } from '@odysseon/ur-ui';
import { SelectDirective } from '@odysseon/ur-ui';
import { InputDirective } from '@odysseon/ur-ui';
import { TextareaDirective } from '@odysseon/ur-ui';
import { ServiceAreaEditor, ServiceAreaEditorSaveEvent } from '../../../../../shared/ui/organisms/service-area-editor/service-area-editor';
import { IBaseServiceArea } from '../../business.interface';
import { LucideCheck, LucideEdit2, LucidePlus, LucideTrash2 } from '@lucide/angular';

interface IMedia {
  id: string;
  url: string;
  role: 'COVER' | 'GALLERY';
}

@Component({
  selector: 'app-edit-listing',
  imports: [FormField, AppFormField, LucideSave, MediaSelector, Button, SelectDirective, InputDirective, TextareaDirective, ServiceAreaEditor, LucideCheck, LucideEdit2, LucidePlus, LucideTrash2],
  templateUrl: './edit-listing.html',
  styleUrl: './edit-listing.css',
})

export class EditListing implements OnInit {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #categoryService = inject(CategoryService);
  #mediaService = inject(MediaService);

  readonly listingId = signal<string>('');
  readonly listing = signal<IListing | null>(null);
  readonly categories = signal<ICategory[]>([]);
  readonly attributes = signal<ICategoryAttribute[]>([]);
  readonly businessServiceAreas = signal<IBaseServiceArea[]>([]);

  // Media State
  readonly coverMedia = signal<IMedia | null>(null);
  readonly galleryMedia = signal<IMedia[]>([]);

  readonly initialCoverUrl = computed(() => this.coverMedia()?.url ?? []);
  readonly initialGalleryUrls = computed(() => this.galleryMedia().map(m => m.url));

  // Media Tracking State (Deferred Uploads)
  readonly coverFileToAdd = signal<File | null>(null);
  readonly galleryFilesToAdd = signal<File[]>([]);
  readonly mediaIdsToDelete = signal<string[]>([]);

  // Form State
  readonly editModel = signal({
    title: '',
    description: '',
    categoryId: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    isNegotiable: false,
    availability: 'IN_STOCK',
    attributesData: {} as Record<string, any>,
    serviceAreas: [] as IBaseServiceArea[],
  });

  readonly editForm = form(this.editModel, (f) => {
    required(f.title, { message: 'Title is required' });
    required(f.availability, { message: 'Availability is required' });
  });

  readonly availabilityMode = signal<'INHERIT' | 'CUSTOM'>('INHERIT');
  readonly isServiceAreaModalOpen = signal(false);
  readonly editingServiceArea = signal<IBaseServiceArea | null>(null);
  readonly editingServiceAreaIndex = signal<number | null>(null);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);

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

      const biz = await firstValueFrom(
        this.#http.get<any>(`${environment.apiUrl}/business/mine`)
      );
      this.businessServiceAreas.set(biz.serviceAreas || []);

      const attrsData = l.attributes || {};
      
      this.editModel.set({
        title: l.title,
        description: l.description || '',
        categoryId: l.categoryId || '',
        minPrice: l.minPrice ? Number(l.minPrice) : null,
        maxPrice: l.maxPrice ? Number(l.maxPrice) : null,
        isNegotiable: l.isNegotiable ?? false,
        availability: l.availability ?? 'IN_STOCK',
        attributesData: attrsData,
        serviceAreas: l.serviceAreas ?? [],
      });

      if (l.serviceAreas && l.serviceAreas.some(a => a.type === 'INHERIT')) {
        this.availabilityMode.set('INHERIT');
      } else if (l.serviceAreas && l.serviceAreas.length > 0) {
        this.availabilityMode.set('CUSTOM');
      } else {
        this.availabilityMode.set('INHERIT'); // default
      }

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
      
      this.editModel.update(m => {
        const currentAttrs = { ...m.attributesData };
        attrs.forEach(attr => {
          if (currentAttrs[attr.key] === undefined) {
            currentAttrs[attr.key] = '';
          }
        });
        return { ...m, attributesData: currentAttrs };
      });
    } else {
      this.attributes.set([]);
    }
  }

  async onCategoryChange(catId: string) {
    this.editModel.update(m => ({ ...m, categoryId: catId, attributesData: {} }));
    await this.loadCategoryAttributes(catId);
  }

  updateAttribute(key: string, value: any) {
    this.editModel.update(m => ({
      ...m,
      attributesData: {
        ...m.attributesData,
        [key]: value
      }
    }));
  }

  async saveChanges() {
    if (this.editForm().invalid()) {
      this.editForm().markAsTouched();
      return;
    }
    this.isSaving.set(true);
    try {
      // 1. Save listing details
      const m = this.editModel();
      const payload: any = {
        title: m.title,
        description: m.description,
        categoryId: m.categoryId,
        price: (m.minPrice !== null || m.maxPrice !== null) ? {
          minPrice: m.minPrice ?? 0,
          maxPrice: m.maxPrice ?? undefined,
          isNegotiable: m.isNegotiable,
          currencyCode: 'NGN'
        } : undefined,
        availability: m.availability,
        attributes: m.attributesData,
        serviceAreas: this.availabilityMode() === 'INHERIT' 
            ? [{ type: 'INHERIT' }] 
            : m.serviceAreas
      };

      await firstValueFrom(
        this.#http.patch(`${environment.apiUrl}/listings/${this.listingId()}`, payload),
      );

      // 2. Process Deletions
      const toDelete = this.mediaIdsToDelete();
      if (toDelete.length > 0) {
        for (const id of toDelete) {
          await firstValueFrom(
            this.#http.delete(`${environment.apiUrl}/listings/${this.listingId()}/media/${id}`)
          ).catch(() => {});
        }
      }

      // 3. Process Uploads
      const cover = this.coverFileToAdd();
      if (cover) {
        await this.uploadMedia(cover, 'COVER');
      }

      const gallery = this.galleryFilesToAdd();
      if (gallery.length > 0) {
        for (const file of gallery) {
          await this.uploadMedia(file, 'GALLERY');
        }
      }

      // 4. Reload Data to sync state
      await this.loadData();
      this.coverFileToAdd.set(null);
      this.galleryFilesToAdd.set([]);
      this.mediaIdsToDelete.set([]);

      this.#toast.success('Saved', 'Listing updated successfully.');
    } catch (err) {
      this.#toast.error('Error', 'Could not update listing.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCoverChanged(files: File[]) {
    this.coverFileToAdd.set(files[0] ?? null);
  }

  onCoverRemoved(url: string) {
    const media = this.coverMedia();
    if (media && media.url === url) {
      this.mediaIdsToDelete.update(ids => [...ids, media.id]);
      this.coverMedia.set(null);
    }
  }

  onGalleryChanged(files: File[]) {
    this.galleryFilesToAdd.set(files);
  }

  onGalleryRemoved(url: string) {
    const media = this.galleryMedia().find(m => m.url === url);
    if (media) {
      this.mediaIdsToDelete.update(ids => [...ids, media.id]);
      this.galleryMedia.update(g => g.filter(m => m.id !== media.id));
    }
  }



  private async uploadMedia(file: File, role: 'COVER' | 'GALLERY') {
    try {
      await new Promise<void>((resolve, reject) => {
        this.#mediaService.uploadMedia('listing', this.listingId(), role, file).subscribe({
          next: (state) => {
            if (state.state === 'complete') {
              resolve();
            }
          },
          error: (err) => reject(err),
        });
      });
    } catch (err) {
      console.error('Failed to upload media', err);
      throw err;
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

  setAvailabilityMode(mode: 'INHERIT' | 'CUSTOM'): void {
    this.availabilityMode.set(mode);
  }

  openServiceAreaModal(area?: IBaseServiceArea, index?: number): void {
    this.editingServiceArea.set(area ?? null);
    this.editingServiceAreaIndex.set(index ?? null);
    this.isServiceAreaModalOpen.set(true);
  }

  closeServiceAreaModal(): void {
    this.isServiceAreaModalOpen.set(false);
    this.editingServiceArea.set(null);
    this.editingServiceAreaIndex.set(null);
  }

  onSaveServiceArea(event: ServiceAreaEditorSaveEvent): void {
    this.editModel.update((m) => {
      const currentAreas = [...(m.serviceAreas ?? [])];
      // Filter out any INHERIT if they were mistakenly added
      const cleanAreas = currentAreas.filter(a => a.type !== 'INHERIT');
      const idx = this.editingServiceAreaIndex();
      if (idx !== null && cleanAreas[idx]) {
        cleanAreas[idx] = event.area;
      } else {
        cleanAreas.push(event.area);
      }
      return { ...m, serviceAreas: cleanAreas };
    });
    this.closeServiceAreaModal();
  }

  removeServiceArea(index: number): void {
    this.editModel.update((m) => {
      const currentAreas = [...(m.serviceAreas ?? [])].filter(a => a.type !== 'INHERIT');
      currentAreas.splice(index, 1);
      return { ...m, serviceAreas: currentAreas };
    });
  }

  formatServiceAreaText(area: IBaseServiceArea): string {
    if (area.name) return area.name;
    switch (area.type) {
      case 'RADIUS': return `${area.radiusKm} km around your business`;
      case 'ADMIN_REGION': return area.administrativeRegionId || 'Specific region';
      case 'NATIONWIDE': return 'Nationwide';
      case 'REMOTE': return 'Online only';
      case 'INHERIT': return 'Use business service areas';
      default: return 'Custom area';
    }
  }
}
