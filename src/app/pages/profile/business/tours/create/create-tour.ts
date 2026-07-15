import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourForm } from '../components/tour-form/tour-form';
import { AppHeader } from '../../../../../shared/app-header/app-header';
import { BusinessTourService, CreateBusinessTourDto, BusinessTourStatus } from '../../../../../core/services/business-tour.service';
import { MediaService } from '../../../../../core/services/media.service';

@Component({
  selector: 'app-create-tour',
  imports: [AppHeader, TourForm],
  templateUrl: './create-tour.html',
  styleUrl: './create-tour.css'
})
export class CreateTour {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #tourService = inject(BusinessTourService);
  #mediaService = inject(MediaService);

  isSubmitting = signal(false);

  // We need the business ID from the route. E.g. /profile/business/:id/tours/create
  get businessId(): string {
    // Traverse up to find the business id
    return this.#route.parent?.parent?.snapshot.paramMap.get('id') || '';
  }

  get backLink(): string {
    return `/profile/business/${this.businessId}/tours`;
  }

  onSave(event: { dto: any, files: File[] }): void {
    if (!this.businessId) return;
    this.isSubmitting.set(true);

    this.#tourService.create(this.businessId, event.dto).subscribe({
      next: (tour) => {
        // If files, upload them
        if (event.files.length > 0) {
          // For MVP, we upload one by one sequentially
          let uploaded = 0;
          let hasError = false;
          
          event.files.forEach(file => {
            this.#mediaService.uploadMedia('business-tour', tour.id, 'BUSINESS_TOUR_MEDIA', file)
              .subscribe({
                next: (state) => {
                  if (state.state === 'complete') {
                    uploaded++;
                    if (uploaded === event.files.length) {
                      this.#tourService.update(tour.id, { status: BusinessTourStatus.PUBLISHED }).subscribe(() => {
                        this.isSubmitting.set(false);
                        this.#router.navigate([this.backLink]);
                      });
                    }
                  }
                },
                error: (err: any) => {
                  console.error('Error uploading file', err);
                  hasError = true;
                  // Navigate anyway if we fail on one
                  this.isSubmitting.set(false);
                  this.#router.navigate([this.backLink]);
                }
              });
          });
        } else {
          // Publish directly
          this.#tourService.update(tour.id, { status: BusinessTourStatus.PUBLISHED }).subscribe(() => {
            this.isSubmitting.set(false);
            this.#router.navigate([this.backLink]);
          });
        }
      },
      error: (err: any) => {
        console.error('Error creating tour', err);
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.#router.navigate([this.backLink]);
  }
}
