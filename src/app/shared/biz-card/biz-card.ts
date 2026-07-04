import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideStore, LucideMapPin, LucideBookmark } from '@lucide/angular';
import { IBusinessSummary } from '../../pages/home/home.interface';
import { SaveService } from '../../core/services/save.service';

@Component({
  selector: 'app-biz-card',
  imports: [RouterLink, LucideStore, LucideMapPin, LucideBookmark],
  templateUrl: './biz-card.html',
  styleUrl: './biz-card.css'
})
export class AppBizCard {
  readonly biz = input.required<IBusinessSummary>();
  #saveService = inject(SaveService);

  toggleSave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const current = this.biz().isSaved;
    this.biz().isSaved = !current; // Optimistic update
    
    this.#saveService.toggleSaveBusiness(this.biz().id, !!current).subscribe({
      error: () => {
        // Revert on failure
        this.biz().isSaved = current;
      }
    });
  }
}
