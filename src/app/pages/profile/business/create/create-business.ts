import { Component, computed, inject, signal, ViewEncapsulation, model, output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import {
  LucideMapPin,
  LucideStore,
  LucideGlobe,
  LucideLayoutGrid,
  LucideLoaderCircle,
  LucideDynamicIcon,
  LucideIconInput,
} from '@lucide/angular';
import { ToastService } from '../../../../core/services/toast';
import {
  ICreateBusiness,
  ICreateBusinessResponse,
} from './create-business.interface';
import { environment } from '../../../../../environments/environment';
import { AppFormField } from '../../../../shared/form-field/form-field';
import { Drawer } from '../../../../shared/drawer/drawer';
import { LocationSelector } from '../../../../shared/location-selector/location-selector';
import { Location } from '../../../../core/services/location.service';
import { CategoryPicker } from '../../../../shared/category-picker/category-picker';
import { ICategory } from '../../../home/home.interface';



@Component({
  selector: 'app-create-business',
  imports: [FormField, LucideStore, LucideLoaderCircle, Drawer, AppFormField, LocationSelector, CategoryPicker],
  templateUrl: './create-business.html',
  styleUrl: './create-business.css',
  encapsulation: ViewEncapsulation.None,
})
export class CreateBusiness {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toast = inject(ToastService);
  
  readonly isOpen = model<boolean>(false);
  readonly created = output<ICreateBusinessResponse>();
  readonly loading = signal(false);

  readonly model = signal<ICreateBusiness>({
    name: '',
    primaryCategoryId: '',
    contactPhone: '',
    description: '',
    location: '',
    latitude: 0,
    longitude: 0,
  });

  readonly businessForm = form(this.model, (f) => {
    required(f.name, { message: 'Business name is required' });
    minLength(f.name, 2, { message: 'Name must be at least 2 characters' });
    maxLength(f.name, 100, { message: 'Name must be under 100 characters' });
    required(f.primaryCategoryId, { message: 'Please select a category' });
    required(f.contactPhone, { message: 'Phone number is required' });
    minLength(f.contactPhone, 7, { message: 'Phone number is too short' });
    required(f.description, { message: 'Description is required' });
    minLength(f.description, 10, { message: 'Please provide a more detailed description' });
    required(f.location, { message: 'Location is required' });
  });

  readonly isFormInvalid = computed(() => this.businessForm().invalid());

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

  closeDrawer(): void {
    this.isOpen.set(false);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.businessForm().invalid()) {
      this.businessForm().markAsTouched();
      return;
    }
    this.loading.set(true);
    try {
      const payload = this.model();
      const res = await firstValueFrom(
        this.#http.post<ICreateBusinessResponse>(`${environment.apiUrl}/business`, payload),
      );
      this.#toast.success('Business created', 'Your business profile is ready.');
      this.created.emit(res);
      this.closeDrawer();
      this.#router.navigate(['/profile/business'], { queryParams: { action: 'first-listing' } });
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Could not create business. Please try again.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
    } finally {
      this.loading.set(false);
    }
  }
}
