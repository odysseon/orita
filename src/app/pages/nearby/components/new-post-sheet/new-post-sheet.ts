import { Component, inject, signal, output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { form, required, FormField, FormRoot, SchemaPathTree, FieldTree } from '@angular/forms/signals';
import { OpportunityService, CreateOpportunityDto } from '../../../../core/services/opportunity.service';
import { LocationService } from '../../../../core/services/location.service';
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
            const pos = await this.#locationService.getCurrentPosition();

            const loc = await firstValueFrom(
              this.#locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            );
            if (!loc) return { kind: 'locationError', message: 'Failed to determine your location.' };

            const locationDoc = await firstValueFrom(this.#locationService.ensure(loc));
            if (!locationDoc) return { kind: 'locationError', message: 'Failed to save your location.' };

            const dto: CreateOpportunityDto = {
              ...field().value(),
              locationId: locationDoc.id,
            };
            await firstValueFrom(this.#opportunityService.create(dto));

            this.created.emit();
            this.close.emit();
            return undefined;
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create post.';
            return { kind: 'submitError', message };
          }
        },
      },
    }
  );
}
