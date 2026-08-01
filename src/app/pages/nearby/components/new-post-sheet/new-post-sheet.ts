import { Component, inject, signal, output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { form, required, FormField, FormRoot, SchemaPathTree, FieldTree } from '@angular/forms/signals';
import { OpportunityService, CreateOpportunityDto } from '../../../../core/services/opportunity.service';
import { LocationService } from '../../../../core/services/location.service';
import { ToastService } from '../../../../core/services/toast';
import { Drawer } from '../../../../shared/ui/overlays/drawer/drawer';

import { Button } from '../../../../shared/ui/atoms/button/button';
import { AppFormField } from '../../../../shared/ui/atoms/form-field/form-field';
import { SelectDirective, TextareaDirective, InputDirective } from '../../../../shared/ui/atoms/forms';
import { LucideX } from '@lucide/angular';

interface NewPostModel {
  type: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-new-post-sheet',
  standalone: true,
  imports: [
    Drawer,
    FormField,
    FormRoot,
    Button,
    AppFormField,
    SelectDirective,
    TextareaDirective,
    InputDirective,
    LucideX,
  ],
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
            const pos = await this.#locationService.getCurrentPosition();
            this.#toastService.success('Location', 'Location access successful.');

            const loc = await firstValueFrom(
              this.#locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
            );
            if (!loc) {
              this.#toastService.error('Error', 'Failed to determine your location.');
              return { kind: 'locationError', message: 'Failed to determine your location.' };
            }

            const locationDoc = await firstValueFrom(this.#locationService.ensure(loc));
            if (!locationDoc) {
              this.#toastService.error('Error', 'Failed to save your location.');
              return { kind: 'locationError', message: 'Failed to save your location.' };
            }

            const dto: CreateOpportunityDto = {
              ...field().value(),
              locationId: locationDoc.id,
            };
            
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
