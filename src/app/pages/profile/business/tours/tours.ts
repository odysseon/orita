import { Component, input, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { LucideImage, LucidePlus, LucideTrash2, LucideEdit3 } from '@lucide/angular';
import { environment } from '../../../../../environments/environment';
import { IPaginated } from '../../../home/home.interface';
import { BusinessTourService, IBusinessTour, BusinessTourStatus } from '../../../../core/services/business-tour.service';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-business-tours',
  imports: [LucideImage, LucidePlus, LucideTrash2, LucideEdit3, DatePipe],
  templateUrl: './tours.html',
  styleUrl: './tours.css'
})
export class AppBusinessTours {
  readonly businessId = input.required<string>();
  #tourService = inject(BusinessTourService);
  #toast = inject(ToastService);

  readonly toursResource = httpResource<IPaginated<IBusinessTour>>(() => `${environment.apiUrl}/business-profiles/${this.businessId()}/business-tours`);
  readonly isCreating = signal(false);

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

  // Very basic creation stub for MVP
  createTourMock() {
    this.isCreating.set(true);
    this.#tourService.create(this.businessId(), {
      title: 'New Store Tour',
      summary: 'A quick look at our latest inventory.',
      visitDate: new Date().toISOString()
    }).subscribe({
      next: (tour) => {
        this.#toast.success('Draft tour created');
        this.isCreating.set(false);
        this.toursResource.reload();
        // In a real app we'd navigate to edit, but for MVP we just created a draft
      },
      error: () => {
        this.#toast.error('Failed to create tour');
        this.isCreating.set(false);
      }
    });
  }
}
