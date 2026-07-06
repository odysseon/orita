import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  LucideArrowLeft,
  LucideSave,
  LucideImagePlus,
  LucideX,
} from '@lucide/angular';
import { environment } from '../../../../../../environments/environment';
import { ToastService } from '../../../../../core/services/toast';
import { FormsModule } from '@angular/forms';
import { AppFormField } from '../../../../../shared/form-field/form-field';
import { BusinessTourService, IBusinessTour, BusinessTourStatus, IBusinessTourMediaItem } from '../../../../../core/services/business-tour.service';

@Component({
  selector: 'app-edit-tour',
  imports: [
    FormsModule,
    AppFormField,
    LucideSave,
    LucideImagePlus,
    LucideX,
  ],
  templateUrl: './edit-tour.html',
  styleUrl: './edit-tour.css',
})
export class EditTour implements OnInit {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #tourService = inject(BusinessTourService);

  readonly tourId = signal<string>('');
  readonly tour = signal<IBusinessTour | null>(null);
  
  // Media State
  readonly galleryMedia = signal<IBusinessTourMediaItem[]>([]);
  
  // Form State
  readonly title = signal('');
  readonly summary = signal('');
  readonly visitDate = signal('');
  readonly status = signal<BusinessTourStatus>(BusinessTourStatus.DRAFT);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isUploadingGallery = signal(false);

  ngOnInit() {
    this.tourId.set(this.#route.snapshot.paramMap.get('tourId') ?? '');
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // 1. Fetch Tour
      const t = await firstValueFrom(this.#tourService.get(this.tourId()));
      this.tour.set(t);
      
      // Initialize form fields
      this.title.set(t.title);
      this.summary.set(t.summary || '');
      this.status.set(t.status);

      // format visitDate to YYYY-MM-DD for date input
      if (t.visitDate) {
        const dateObj = new Date(t.visitDate);
        this.visitDate.set(dateObj.toISOString().split('T')[0]);
      } else {
        this.visitDate.set('');
      }

      // 2. Fetch Tour Media
      const mediaRes = await firstValueFrom(
        this.#http.get<{ items: IBusinessTourMediaItem[] }>(`${environment.apiUrl}/business-tours/${this.tourId()}/media`)
      );
      this.galleryMedia.set(mediaRes.items || []);

    } catch (err) {
      this.#toast.error('Error', 'Could not load tour details.');
      this.#router.navigate(['../../'], { relativeTo: this.#route });
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveChanges() {
    this.isSaving.set(true);
    try {
      const payload = {
        title: this.title(),
        summary: this.summary(),
        visitDate: new Date(this.visitDate()).toISOString(),
        status: this.status()
      };
      
      await firstValueFrom(this.#tourService.update(this.tourId(), payload));
      this.#toast.success('Done', 'Tour updated successfully.');
    } catch (err) {
      this.#toast.error('Error', 'Could not update tour.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async publishTour() {
    this.status.set(BusinessTourStatus.PUBLISHED);
    await this.saveChanges();
  }

  async onGalleryUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    this.isUploadingGallery.set(true);
    
    // Upload sequentially
    for (let i = 0; i < files.length; i++) {
      await this.uploadMedia(files[i]);
    }
    this.isUploadingGallery.set(false);
  }

  private async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', 'GALLERY');

    try {
      const res = await firstValueFrom(
        this.#http.post<IBusinessTourMediaItem>(`${environment.apiUrl}/business-tours/${this.tourId()}/media`, formData)
      );
      this.galleryMedia.update(g => [...g, res]);
    } catch (err) {
      this.#toast.error('Error', 'Could not upload media.');
    }
  }

  async deleteMedia(mediaId: string) {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    
    try {
      await firstValueFrom(this.#http.delete(`${environment.apiUrl}/media/${mediaId}`));
      this.galleryMedia.update(g => g.filter(m => m.id !== mediaId));
      this.#toast.success('Done', 'Media deleted.');
    } catch (err) {
      this.#toast.error('Error', 'Could not delete media.');
    }
  }
}
