import { Component, input, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { BusinessTourService, IBusinessTour } from '../../core/services/business-tour.service';
import { ShareButton } from '../../shared/share-button/share-button';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { SeoComponent } from '../../shared/seo/seo.component';
import { LucideImage, LucideCalendar, LucideCheckCircle } from '@lucide/angular';
import { LayoutPage } from '../../shared/layout/sub-layout/layout-page.interface';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour-detail',
  imports: [ShareButton, EmptyState, SeoComponent, LucideImage, LucideCalendar, LucideCheckCircle, DatePipe],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css'
})
export class TourDetail implements LayoutPage {
  readonly id = input.required<string>();
  #tourService = inject(BusinessTourService);

  readonly tourResource = httpResource<IBusinessTour>(() => `${environment.apiUrl}/business-tours/${this.id()}`);

  readonly pageTitle = computed(() => this.tourResource.value()?.title);

  readonly seoConfig = computed(() => {
    const tour = this.tourResource.value();
    if (!tour) return { title: 'Business Tour' };

    return {
      title: tour.title,
      description: tour.summary || `Take a business tour: ${tour.title}`,
      image: tour.media?.[0]?.url || undefined,
      url: `https://orita.onrender.com/tours/${tour.id}`,
      type: 'article' as const
    };
  });
}
