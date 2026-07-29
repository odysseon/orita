import { Component, computed, inject, signal, effect, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parsePhoneNumberWithError, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import {
  LucideLoaderCircle,
  LucideGlobe,
  LucideMapPin,
  LucideLayoutGrid,
  LucideIconInput,
  LucideTrash2,
} from '@lucide/angular';
import { ToastService } from '../../../../core/services/toast';
import { IBusinessProfile, BusinessType } from '../business.interface';
import { environment } from '../../../../../environments/environment';
import { AppFormField } from '../../../../shared/ui/atoms/form-field/form-field';
import { MediaSelector } from '../../../../shared/media-selector/media-selector';
import { ICategory } from '../../../home/home.interface';
import { CategoryPicker } from '../../../../shared/ui/organisms/category-picker/category-picker';
import { LocationPicker } from '../../../../shared/ui/organisms/location-picker/location-picker';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { Skeleton } from '../../../../shared/ui/atoms/skeleton/skeleton';
import { InputDirective } from '../../../../shared/ui/atoms/forms/input';
import { TextareaDirective } from '../../../../shared/ui/atoms/forms/textarea';
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
  imports: [FormField, AppFormField, MediaSelector, LocationPicker, LucideLoaderCircle, CategoryPicker, Button, Skeleton, InputDirective, TextareaDirective],
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
  readonly selectedCountryCode = signal<CountryCode | undefined>(undefined);

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
    if (loc.countryCode) {
      this.selectedCountryCode.set(loc.countryCode.toUpperCase() as CountryCode);
    }
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

  readonly phonePlaceholder = computed(() => {
    const cc = this.selectedCountryCode();
    if (cc) {
      try {
        return `e.g. +${getCountryCallingCode(cc)}...`;
      } catch { }
    }
    return 'e.g. +1234567890';
  });

  readonly phoneWarning = computed(() => {
    const phone = this.model().contactPhone;
    const locCountry = this.selectedCountryCode();
    if (phone && locCountry) {
      try {
        const parsed = parsePhoneNumberWithError(phone, locCountry);
        if (parsed.isValid() && parsed.country && parsed.country !== locCountry) {
          return `This business is located in ${locCountry} but uses a ${parsed.country} phone number.`;
        }
      } catch { }
    }
    return null;
  });

  readonly whatsappWarning = computed(() => {
    const phone = this.model().whatsapp;
    const locCountry = this.selectedCountryCode();
    if (phone && locCountry) {
      try {
        const parsed = parsePhoneNumberWithError(phone, locCountry);
        if (parsed.isValid() && parsed.country && parsed.country !== locCountry) {
          return `This business is located in ${locCountry} but uses a ${parsed.country} WhatsApp number.`;
        }
      } catch { }
    }
    return null;
  });

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

      try {
        if (payload.contactPhone) {
          const parsed = parsePhoneNumberWithError(payload.contactPhone, this.selectedCountryCode());
          if (!parsed.isValid()) {
             this.#toast.error('Invalid phone', 'Please enter a valid phone number.');
             this.loading.set(false);
             return;
          }
          payload.contactPhone = parsed.format('E.164');
        }
        if (payload.whatsapp) {
          const parsed = parsePhoneNumberWithError(payload.whatsapp, this.selectedCountryCode());
          if (!parsed.isValid()) {
             this.#toast.error('Invalid WhatsApp', 'Please enter a valid WhatsApp number.');
             this.loading.set(false);
             return;
          }
          payload.whatsapp = parsed.format('E.164');
        }
      } catch {
        this.#toast.error('Invalid phone', 'Please enter a valid phone/WhatsApp number.');
        this.loading.set(false);
        return;
      }

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
