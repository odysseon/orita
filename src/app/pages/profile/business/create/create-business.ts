import { Component, computed, inject, signal, ViewEncapsulation, model, output, OnInit } from '@angular/core';
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
  BusinessType,
} from './create-business.interface';
import { environment } from '../../../../../environments/environment';
import { AppFormField } from '../../../../shared/form-field/form-field';
import { Drawer } from '../../../../shared/drawer/drawer';
import { ExplorationService } from '../../../../core/services/exploration.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ICategory } from '../../../home/home.interface';

interface BusinessTypeOption {
  value: BusinessType;
  label: string;
  description: string;
  icon: LucideIconInput;
}

@Component({
  selector: 'app-create-business',
  imports: [FormField, LucideStore, LucideLoaderCircle, Drawer, LucideDynamicIcon, AppFormField],
  templateUrl: './create-business.html',
  styleUrl: './create-business.css',
  encapsulation: ViewEncapsulation.None,
})
export class CreateBusiness implements OnInit {
  #http = inject(HttpClient);
  #router = inject(Router);
  #toast = inject(ToastService);
  #exploration = inject(ExplorationService);
  #categoryService = inject(CategoryService);
  
  readonly isOpen = model<boolean>(false);
  readonly created = output<void>();
  readonly loading = signal(false);

  readonly model = signal<ICreateBusiness>({
    name: '',
    businessType: 'ONLINE',
    primaryCategoryId: '',
  });

  readonly businessForm = form(this.model, (f) => {
    required(f.name, { message: 'Business name is required' });
    minLength(f.name, 2, { message: 'Name must be at least 2 characters' });
    maxLength(f.name, 100, { message: 'Name must be under 100 characters' });
    required(f.primaryCategoryId, { message: 'Please select a category' });
  });

  readonly isFormInvalid = computed(() => this.businessForm().invalid());
  readonly activeLocation = this.#exploration.activeLocation;
  readonly categories = signal<ICategory[]>([]);

  ngOnInit() {
    this.categories.set(this.#categoryService.leafCategories());
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

  selectType(type: BusinessType): void {
    this.model.update((m) => ({ ...m, businessType: type }));
  }

  closeDrawer(): void {
    this.isOpen.set(false);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.businessForm().invalid()) return;
    this.loading.set(true);
    try {
      const loc = this.activeLocation();
      const payload = {
        name: this.model().name,
        businessType: this.model().businessType,
        primaryCategoryId: this.model().primaryCategoryId,
        secondaryCategoryIds: this.model().secondaryCategoryIds ?? [],
        ...(loc ? { 
          location: loc.name,
          latitude: loc.lat,
          longitude: loc.lng
        } : {})
      };
      const res = await firstValueFrom(
        this.#http.post<ICreateBusinessResponse>(`${environment.apiUrl}/business`, payload),
      );
      this.#toast.success('Business created', 'Your business profile is ready.');
      this.created.emit();
      this.closeDrawer();
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
