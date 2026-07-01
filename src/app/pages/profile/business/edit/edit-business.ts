import { Component, computed, inject, signal, effect } from '@angular/core';
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
  phoneNumber: string;
  whatsapp: string;
  email: string;
  location: string;
  isPublic: boolean;
}

@Component({
  selector: 'app-edit-business',
  imports: [FormField, LucideLoaderCircle, AppFormField],
  templateUrl: './edit-business.html',
  styleUrl: './edit-business.css',
})
export class EditBusiness {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toast = inject(ToastService);

  readonly business = httpResource<IBusinessProfile>(
    () => `${environment.apiUrl}/users/me/business`
  );

  readonly loading = signal(false);

  readonly model = signal<IEditBusinessForm>({
    name: '',
    businessType: 'ONLINE',
    description: '',
    websiteUrl: '',
    phoneNumber: '',
    whatsapp: '',
    email: '',
    location: '',
    isPublic: false,
  });

  readonly businessForm = form(this.model, (f) => {
    required(f.name, { message: 'Business name is required' });
    minLength(f.name, 2, { message: 'Name must be at least 2 characters' });
    maxLength(f.name, 100, { message: 'Name must be under 100 characters' });
    maxLength(f.description, 1000, { message: 'Description must be under 1000 characters' });
    maxLength(f.websiteUrl, 200, { message: 'Website URL must be under 200 characters' });
    maxLength(f.phoneNumber, 20, { message: 'Phone number must be under 20 characters' });
    maxLength(f.whatsapp, 20, { message: 'WhatsApp number must be under 20 characters' });
    maxLength(f.email, 100, { message: 'Email must be under 100 characters' });
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
          phoneNumber: biz.phoneNumber ?? '',
          whatsapp: biz.whatsapp ?? '',
          email: biz.email ?? '',
          location: biz.location ?? '',
          isPublic: biz.isPublic,
        });
      }
    });
  }

  selectType(type: BusinessType): void {
    this.model.update((m) => ({ ...m, businessType: type }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.businessForm().invalid()) return;
    const biz = this.business.value();
    if (!biz) return;

    this.loading.set(true);
    try {
      const payload = {
        name: this.model().name,
        businessType: this.model().businessType,
        description: this.model().description || null,
        websiteUrl: this.model().websiteUrl || null,
        phoneNumber: this.model().phoneNumber || null,
        whatsapp: this.model().whatsapp || null,
        email: this.model().email || null,
        location: this.model().location || null,
        isPublic: this.model().isPublic,
      };

      await firstValueFrom(
        this.#http.patch(`${environment.apiUrl}/business/${biz.id}`, payload)
      );

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
