import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IMediaResponse {
  id: string;
  url: string;
  mediaType: 'IMAGE' | 'VIDEO';
  order: number | null;
  createdAt: string;
}

@Service()
export class MediaService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  uploadTourMedia(tourId: string, file: File): Observable<IMediaResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', 'GALLERY');

    return this.#http.post<IMediaResponse>(
      `${this.#apiUrl}/business-tours/${tourId}/media`,
      formData
    );
  }

  deleteMedia(mediaId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/media/${mediaId}`);
  }
}
