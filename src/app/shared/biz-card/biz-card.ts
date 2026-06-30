import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideStore, LucideMapPin, LucideBookmark } from '@lucide/angular';
import { IBusinessSummary } from '../../pages/home/home.interface';

@Component({
  selector: 'app-biz-card',
  imports: [RouterLink, LucideStore, LucideMapPin, LucideBookmark],
  templateUrl: './biz-card.html',
  styleUrl: './biz-card.css'
})
export class AppBizCard {
  readonly biz = input.required<IBusinessSummary>();
}
