import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { OpportunityService, CreateOpportunityDto } from '../../../../core/services/opportunity.service';
import { LocationService } from '../../../../core/services/location.service';
import { Drawer } from '../../../../shared/drawer/drawer';
import { LucideX, LucideLoaderCircle } from '@lucide/angular';

@Component({
  selector: 'app-new-post-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, Drawer, LucideX, LucideLoaderCircle],
  templateUrl: './new-post-sheet.html',
  styleUrls: ['./new-post-sheet.css'],
})
export class NewPostSheet {
  #opportunityService = inject(OpportunityService);
  #locationService = inject(LocationService);

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  types = [
    { value: 'TEMP_SERVICE', label: 'Temp Service' },
    { value: 'FREE', label: 'Free Stuff' },
    { value: 'WANTED', label: 'Wanted' },
    { value: 'FOR_SALE', label: 'For Sale' },
    { value: 'BORROW_LEND', label: 'Borrow / Lend' },
    { value: 'LOST_FOUND', label: 'Lost / Found' },
  ];

  model: Partial<CreateOpportunityDto> = {
    type: 'TEMP_SERVICE',
    title: '',
    body: '',
  };

  loading = signal(false);
  error = signal<string | null>(null);

  async submit() {
    if (!this.model.title || !this.model.type) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const pos = await this.#locationService.getCurrentPosition();
      
      const locObs = this.#locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      const loc = await firstValueFrom(locObs);

      if (!loc) {
        throw new Error('Failed to determine location.');
      }
      
      const ensureObs = this.#locationService.ensure(loc);
      const locationDoc = await firstValueFrom(ensureObs);
      
      if (!locationDoc) {
        throw new Error('Failed to ensure location.');
      }

      this.model.locationId = locationDoc.id;

      const createObs = this.#opportunityService.create(this.model as CreateOpportunityDto);
      await firstValueFrom(createObs);
      
      this.created.emit();
      this.close.emit();
    } catch (err: any) {
      this.error.set(err.message || 'Failed to create post.');
    } finally {
      this.loading.set(false);
    }
  }
}
