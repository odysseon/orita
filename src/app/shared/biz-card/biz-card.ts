import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideStore, LucideMapPin, LucideBookmark } from '@lucide/angular';
import { IBusinessSummary } from '../../pages/home/home.interface';
import { FollowService } from '../../core/services/follow.service';

@Component({
  selector: 'app-biz-card',
  imports: [RouterLink, LucideStore, LucideMapPin, LucideBookmark],
  templateUrl: './biz-card.html',
  styleUrl: './biz-card.css'
})
export class AppBizCard {
  readonly biz = input.required<IBusinessSummary>();
  #followService = inject(FollowService);

  toggleSave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const current = this.biz().isFollowed;
    this.biz().isFollowed = !current; // Optimistic update
    
    this.#followService.toggleFollow('business', this.biz().id, !!current).subscribe({
      error: () => {
        // Revert on failure
        this.biz().isFollowed = current;
      }
    });
  }
}
