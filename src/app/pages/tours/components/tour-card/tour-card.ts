import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideMapPin,
  LucideMessageCircle,
  LucideStore,
  LucideHeart,
  LucideCheckCircle2,
  LucideWifi,
  LucideCar,
  LucideCreditCard,
  LucideBaby
} from '@lucide/angular';
import { IBusinessTour } from '../../../../core/services/business-tour.service';

@Component({
  selector: 'app-tour-card',
  imports: [
    LucideMapPin,
    LucideMessageCircle,
    LucideStore,
    LucideHeart,
    LucideCheckCircle2,
    LucideWifi,
    LucideCar,
    LucideCreditCard,
    LucideBaby
  ],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css',
})
export class TourCard {
  tour = input.required<IBusinessTour>();
  businessData = input<any>();

  actionClick = output<'directions' | 'business' | 'message' | 'save'>();

  // Helper for mock quick facts since it's not in the schema yet
  get quickFacts(): string[] {
    return ['Wi-Fi', 'Parking', 'Accepts Cards'];
  }

  handleAction(action: 'directions' | 'business' | 'message' | 'save'): void {
    this.actionClick.emit(action);
  }
}
