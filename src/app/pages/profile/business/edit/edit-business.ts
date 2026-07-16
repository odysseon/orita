import { Component, computed, inject, signal, effect, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import {
  LucideLoaderCircle,
  LucideGlobe,
  LucideMapPin,
  LucideLayoutGrid,
  LucideIconInput,
} from '@lucide/angular';
import { ToastService } from '../../../../core/services/toast';
import { IBusinessProfile, BusinessType } from '../business.interface';
import { environment } from '../../../../../environments/environment';
import { AppFormField } from '../../../../shared/form-field/form-field';
import { MediaSelector } from '../../../../shared/media-selector/media-selector';
import { ICategory } from '../../../home/home.interface';
import { CategoryPicker } from '../../../../shared/category-picker/category-picker';
import { LocationPicker } from '../../../../shared/location-picker/location-picker';
import { Location } from '../../../../core/services/location.service';
import { MediaService } from '../../../../core/services/media.service';

interface BusinessTypeOption {
  value: BusinessType;
  label: string;
  description: string;
  icon: LucideIconInput;
}

export interface IEditBusinessForm {
  name: string;
  businessType: BusinessType;
  description: string;
  websiteUrl: string;
  contactPhone: string;
  whatsapp: string;
  contactEmail: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  primaryCategoryId: string;
  secondaryCategoryIds: string[];
}

@Component({
  selector: 'app-edit-business',
  imports: [FormField, AppFormField, MediaSelector, LocationPicker, LucideLoaderCircle, CategoryPicker],
  templateUrl: './edit-business.html',
  styleUrl: './edit-business.css',
})
export class EditBusiness implements OnInit {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toast = inject(ToastService);

  readonly business = httpResource<IBusinessProfile>(
    () => `${environment.apiUrl}/users/me/business`
  );

  readonly loading = signal(false);
  readonly avatarFile = signal<File | null>(null);
  readonly coverFile = signal<File | null>(null);
  #mediaService = inject(MediaService);

  readonly categories = signal<ICategory[]>([]);

  ngOnInit() {
  }

  readonly availableSecondaryCategories = computed(() => {
    const primaryId = this.model().primaryCategoryId;
    return this.categories().filter((c) => c.id !== primaryId);
  });

  toggleSecondaryCategory(categoryId: string): void {
    this.model.update((m) => {
      const current = m.secondaryCategoryIds ?? [];
      if (current.includes(categoryId)) {
        return { ...m, secondaryCategoryIds: current.filter((id) => id !== categoryId) };
      } else if (current.length < 5) {
        return { ...m, secondaryCategoryIds: [...current, categoryId] };
      } else {
        this.#toast.error('Limit Reached', 'You can only select up to 5 secondary categories.');
        return m;
      }
    });
  }

  isSecondaryCategorySelected(categoryId: string): boolean {
    return (this.model().secondaryCategoryIds ?? []).includes(categoryId);
  }

  onLocationPicked(loc: Location): void {
    this.model.update((m) => ({
      ...m,
      location: loc.name || loc.formattedAddress || 'Unknown',
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
  }

  onCategoryPicked(id: string): void {
    this.model.update((m) => ({ ...m, primaryCategoryId: id }));
  }

  readonly model = signal<IEditBusinessForm>({
    name: '',
    businessType: 'ONLINE',
    description: '',
    websiteUrl: '',
    contactPhone: '',
    whatsapp: '',
    contactEmail: '',
    location: '',
    latitude: null,
    longitude: null,
    primaryCategoryId: '',
    secondaryCategoryIds: [],
  });

  readonly businessForm = form(this.model, (f) => {
    required(f.name, { message: 'Business name is required' });
    minLength(f.name, 2, { message: 'Name must be at least 2 characters' });
    maxLength(f.name, 100, { message: 'Name must be under 100 characters' });
    maxLength(f.description, 1000, { message: 'Description must be under 1000 characters' });
    maxLength(f.websiteUrl, 200, { message: 'Website URL must be under 200 characters' });
    maxLength(f.contactPhone, 20, { message: 'Phone number must be under 20 characters' });
    maxLength(f.whatsapp, 20, { message: 'WhatsApp number must be under 20 characters' });
    maxLength(f.contactEmail, 100, { message: 'Email must be under 100 characters' });
    maxLength(f.location, 200, { message: 'Location must be under 200 characters' });
  });

  readonly isFormInvalid = computed(() => this.businessForm().invalid());

  readonly typeOptions: BusinessTypeOption[] = [
    {
      value: 'ONLINE',
      label: 'Online',
      description: 'Operates entirely online',
      icon: LucideGlobe,
    },
    {
      value: 'PHYSICAL',
      label: 'Physical',
      description: 'Has a physical location',
      icon: LucideMapPin,
    },
    {
      value: 'HYBRID',
      label: 'Hybrid',
      description: 'Online and in-person',
      icon: LucideLayoutGrid,
    },
  ];

  constructor() {
    effect(() => {
      const biz = this.business.value();
      if (biz) {
        this.model.set({
          name: biz.name,
          businessType: biz.businessType,
          description: biz.description ?? '',
          websiteUrl: biz.websiteUrl ?? '',
          contactPhone: biz.contactPhone ?? '',
          whatsapp: biz.whatsapp ?? '',
          contactEmail: biz.contactEmail ?? '',
          location: biz.location ?? '',
          latitude: biz.latitude ?? null,
          longitude: biz.longitude ?? null,
          primaryCategoryId: biz.primaryCategoryId ?? '',
          secondaryCategoryIds: biz.secondaryCategoryIds ?? [],
        });
      }
    });
  }

  selectType(type: BusinessType): void {
    this.model.update((m) => ({ ...m, businessType: type }));
  }

  onAvatarChanged(files: File[]): void {
    this.avatarFile.set(files[0] || null);
  }

  onAvatarRemoved(): void {
    this.avatarFile.set(null);
  }

  onCoverChanged(files: File[]): void {
    this.coverFile.set(files[0] || null);
  }

  onCoverRemoved(): void {
    this.coverFile.set(null);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.businessForm().invalid()) {
      this.businessForm().markAsTouched();
      return;
    }
    const biz = this.business.value();
    if (!biz) return;

    this.loading.set(true);
    try {
      const payload = {
        name: this.model().name,
        businessType: this.model().businessType,
        ...(this.model().description && { description: this.model().description }),
        ...(this.model().websiteUrl && { websiteUrl: this.model().websiteUrl }),
        ...(this.model().contactPhone && { contactPhone: this.model().contactPhone }),
        ...(this.model().whatsapp && { whatsapp: this.model().whatsapp }),
        ...(this.model().contactEmail && { contactEmail: this.model().contactEmail }),
        ...(this.model().location && { location: this.model().location }),
        ...(this.model().latitude !== null && { latitude: this.model().latitude }),
        ...(this.model().longitude !== null && { longitude: this.model().longitude }),
        primaryCategoryId: this.model().primaryCategoryId,
        ...(this.model().secondaryCategoryIds.length > 0 && { secondaryCategoryIds: this.model().secondaryCategoryIds }),
      };

      await firstValueFrom(
        this.#http.patch(`${environment.apiUrl}/business/${biz.id}`, payload)
      );

      const avatar = this.avatarFile();
      if (avatar) {
        await new Promise<void>((resolve, reject) => {
          this.#mediaService.uploadMedia('business-profile', biz.id, 'LOGO', avatar).subscribe({
            next: (state) => {
              if (state.state === 'complete') resolve();
            },
            error: (err) => reject(err),
          });
        });
      }

      const cover = this.coverFile();
      if (cover) {
        await new Promise<void>((resolve, reject) => {
          this.#mediaService.uploadMedia('business-profile', biz.id, 'BANNER', cover).subscribe({
            next: (state) => {
              if (state.state === 'complete') resolve();
            },
            error: (err) => reject(err),
          });
        });
      }

      this.#toast.success('Profile updated', 'Your business profile has been updated.');
      this.#router.navigate(['/profile/business']);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Could not update profile. Please try again.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
    } finally {
      this.loading.set(false);
    }
  }
}
