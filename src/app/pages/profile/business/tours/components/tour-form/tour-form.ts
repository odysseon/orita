import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { TourFormHighlights } from '../tour-form-highlights/tour-form-highlights';
import { MediaSelector } from '../../../../../../shared/media-selector/media-selector';
import { CreateBusinessTourDto, UpdateBusinessTourDto, IBusinessTour, BusinessTourStatus } from '../../../../../../core/services/business-tour.service';

@Component({
  selector: 'app-tour-form',
  imports: [FormField, TourFormHighlights, MediaSelector],
  templateUrl: './tour-form.html',
  styleUrl: './tour-form.css'
})
export class TourForm implements OnInit {


  initialData = input<IBusinessTour | null>(null);
  isSubmitting = input(false);

  readonly save = output<{ dto: CreateBusinessTourDto | UpdateBusinessTourDto, files: File[] }>();
  readonly cancel = output<void>();

  readonly tourModel = signal({
    title: '',
    summary: '',
    visitDate: ''
  });

  readonly tourForm = form(this.tourModel, (f) => {
    required(f.title);
    required(f.visitDate);
  });
  isEdit = signal(false);
  highlights = signal<string[]>([]);
  
  selectedFiles: File[] = [];
  initialMediaUrls: string[] = [];

  ngOnInit(): void {
    const data = this.initialData();
    this.isEdit.set(!!data);

    // Format date for date input (YYYY-MM-DD)
    let dateStr = new Date().toISOString().split('T')[0];
    if (data?.visitDate) {
      dateStr = new Date(data.visitDate).toISOString().split('T')[0];
    }

    this.tourModel.set({
      title: data?.title || '',
      summary: data?.summary || '',
      visitDate: dateStr
    });

    if (data?.highlights) {
      this.highlights.set(data.highlights.map(h => h.value));
    }
    
    if (data?.media) {
      this.initialMediaUrls = data.media.map(m => m.url);
    }
  }

  onHighlightsChange(newHighlights: string[]): void {
    this.highlights.set(newHighlights);
  }

  onFilesChanged(files: File[]): void {
    this.selectedFiles = files;
  }

  onMediaRemoved(url: string): void {
    // Keep track of removed existing media if needed by API.
    // Right now, our API doesn't cleanly support deleting individual media on update without a separate endpoint,
    // so we'll just ignore for the MVP or let the backend handle state sync.
    this.initialMediaUrls = this.initialMediaUrls.filter(u => u !== url);
  }

  onSubmit(): void {
    if (this.tourForm().invalid()) return;

    const val = this.tourModel();
    const dto: any = {
      title: val.title,
      summary: val.summary,
      visitDate: new Date(val.visitDate).toISOString(),
      highlights: this.highlights()
    };

    this.save.emit({ dto, files: this.selectedFiles });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
