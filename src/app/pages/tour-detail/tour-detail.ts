import { Component, input, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { BusinessTourService, IBusinessTour } from '../../core/services/business-tour.service';
import { AppPageHeader } from '../../shared/page-header/page-header';
import { ShareButton } from '../../shared/share-button/share-button';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { LucideImage, LucideCalendar, LucideCheckCircle } from '@lucide/angular';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour-detail',
  imports: [AppPageHeader, ShareButton, EmptyState, LucideImage, LucideCalendar, LucideCheckCircle, DatePipe],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css'
})
export class TourDetail {
  readonly id = input.required<string>();
  #tourService = inject(BusinessTourService);

  readonly tourResource = httpResource<IBusinessTour>(() => `${environment.apiUrl}/business-tours/${this.id()}`);

  goBack() {
    window.history.back();
  }
}
