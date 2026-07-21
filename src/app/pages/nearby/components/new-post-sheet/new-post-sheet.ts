import { Component, inject, signal, output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { form, required, FormField, FormRoot, SchemaPathTree, FieldTree } from '@angular/forms/signals';
import { OpportunityService, CreateOpportunityDto } from '../../../../core/services/opportunity.service';
import { LocationService } from '../../../../core/services/location.service';
import { ToastService } from '../../../../core/services/toast';
import { Drawer } from '../../../../shared/drawer/drawer';
import { LucideX, LucideLoaderCircle } from '@lucide/angular';

interface NewPostModel {
  type: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-new-post-sheet',
  standalone: true,
  imports: [Drawer, FormField, FormRoot, LucideX, LucideLoaderCircle],
  templateUrl: './new-post-sheet.html',
  styleUrls: ['./new-post-sheet.css'],
})
export class NewPostSheet {
  #opportunityService = inject(OpportunityService);
  #locationService = inject(LocationService);
  #toastService = inject(ToastService);

  close = output<void>();
  created = output<void>();

  types = [
    { value: 'TEMP_SERVICE', label: 'Temp Service' },
    { value: 'FREE', label: 'Free Stuff' },
    { value: 'WANTED', label: 'Wanted' },
    { value: 'FOR_SALE', label: 'For Sale' },
    { value: 'BORROW_LEND', label: 'Borrow / Lend' },
    { value: 'LOST_FOUND', label: 'Lost / Found' },
  ];

  postModel = signal<NewPostModel>({
    type: 'TEMP_SERVICE',
    title: '',
    body: '',
  });

  postForm = form(
    this.postModel,
    (schema: SchemaPathTree<NewPostModel>) => {
      required(schema.type, { message: 'Choose a type' });
      required(schema.title, { message: 'Title is required' });
    },
    {
      submission: {
        action: async (
          field: FieldTree<NewPostModel>
        ): Promise<{ kind: string; message: string } | undefined> => {
          try {
            this.#toastService.info('Debug', 'Starting post creation...');
            
            this.#toastService.info('Debug', 'Getting current location...');
            const pos = await this.#locationService.getCurrentPosition();
            this.#toastService.info('Debug', `Got location: ${pos.coords.latitude}, ${pos.coords.longitude}`);

            this.#toastService.info('Debug', 'Reverse geocoding location...');
            const loc = await firstValueFrom(
              this.#locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            );
            if (!loc) {
              this.#toastService.error('Error', 'Failed to determine your location.');
              return { kind: 'locationError', message: 'Failed to determine your location.' };
            }
            this.#toastService.info('Debug', `Geocoded: ${loc.formattedAddress || loc.name}`);

            this.#toastService.info('Debug', 'Ensuring location exists in DB...');
            const locationDoc = await firstValueFrom(this.#locationService.ensure(loc));
            if (!locationDoc) {
              this.#toastService.error('Error', 'Failed to save your location.');
              return { kind: 'locationError', message: 'Failed to save your location.' };
            }

            const dto: CreateOpportunityDto = {
              ...field().value(),
              locationId: locationDoc.id,
            };
            
            this.#toastService.info('Debug', 'Calling API to create opportunity...');
            await firstValueFrom(this.#opportunityService.create(dto));
            this.#toastService.success('Success', 'Opportunity posted successfully!');

            this.created.emit();
            this.close.emit();
            return undefined;
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create post.';
            this.#toastService.error('Error', message);
            return { kind: 'submitError', message };
          }
        },
      },
    }
  );
}
