import { Component, input, signal, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { LucideImage, LucidePlus, LucideTrash2, LucideEdit3 } from '@lucide/angular';
import { environment } from '../../../../../environments/environment';
import { IPaginated } from '../../../home/home.interface';
import { BusinessTourService, IBusinessTour, BusinessTourStatus } from '../../../../core/services/business-tour.service';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-business-tours',
  imports: [RouterLink, FormField, LucideImage, LucidePlus, LucideTrash2, LucideEdit3, DatePipe],
  templateUrl: './tours.html',
  styleUrl: './tours.css'
})
export class AppBusinessTours {
  readonly businessId = input.required<string>();
  #tourService = inject(BusinessTourService);
  #toast = inject(ToastService);

  #router = inject(Router);

  readonly toursResource = httpResource<IPaginated<IBusinessTour>>(() => `${environment.apiUrl}/business-profiles/${this.businessId()}/business-tours`);
  
  readonly isModalOpen = signal(false);
  readonly isCreating = signal(false);
  
  readonly model = signal({
    title: '',
    visitDate: new Date().toISOString().split('T')[0]
  });

  readonly tourForm = form(this.model, (f) => {
    required(f.title);
    required(f.visitDate);
  });

  openCreateModal() {
    this.model.set({ title: '', visitDate: new Date().toISOString().split('T')[0] });
    this.isModalOpen.set(true);
  }

  closeCreateModal() {
    this.isModalOpen.set(false);
  }

  deleteTour(id: string) {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    this.#tourService.delete(id).subscribe({
      next: () => {
        this.#toast.success('Tour deleted');
        this.toursResource.reload();
      },
      error: () => this.#toast.error('Failed to delete tour')
    });
  }

  createTour() {
    if (this.tourForm().invalid()) {
      this.tourForm().markAsTouched();
      return;
    }

    this.isCreating.set(true);
    const m = this.model();
    this.#tourService.create(this.businessId(), {
      title: m.title.trim(),
      summary: '',
      visitDate: new Date(m.visitDate).toISOString()
    }).subscribe({
      next: (tour) => {
        this.#toast.success('Draft tour created');
        this.isCreating.set(false);
        this.isModalOpen.set(false);
        this.#router.navigate(['/profile/business/tours', tour.id, 'edit']);
      },
      error: () => {
        this.#toast.error('Failed to create tour');
        this.isCreating.set(false);
      }
    });
  }
}
