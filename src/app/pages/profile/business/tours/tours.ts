import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { LucidePlus, LucideTrash2, LucideEdit3 } from '@lucide/angular';
import { environment } from '../../../../../environments/environment';
import { IPaginated } from '../../../home/home.interface';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { BusinessTourService, IBusinessTour } from '../../../../core/services/business-tour.service';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-business-tours',
  imports: [RouterLink, LucidePlus, LucideTrash2, DatePipe, Button],
  templateUrl: './tours.html',
  styleUrl: './tours.css'
})
export class AppBusinessTours {
  readonly businessId = input.required<string>();
  #tourService = inject(BusinessTourService);
  #toast = inject(ToastService);

  readonly toursResource = httpResource<IPaginated<IBusinessTour>>(() => `${environment.apiUrl}/business-profiles/${this.businessId()}/business-tours`);
  
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
}
