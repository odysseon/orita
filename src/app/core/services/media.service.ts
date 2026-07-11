import { Service, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, concat, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type MediaResourceType =
  | 'business-profile'
  | 'listing'
  | 'review'
  | 'business-tour';

const ROUTE_MAP: Record<MediaResourceType, string> = {
  'business-profile': 'business-profiles',
  listing: 'listings',
  review: 'reviews',
  'business-tour': 'business-tours',
};

export interface IMediaResponse {
  id: string;
  url: string;
  mediaType: 'IMAGE' | 'VIDEO';
  role: string;
  order: number | null;
  createdAt: string;
}

export interface IUploadIntentRequest {
  role: string;
}

export interface IUploadIntentResponse {
  signature: string;
  timestamp: number;
  apiKey?: string;
  cloudName?: string;
  intentId: string;
  folder: string;
  publicId: string;
}

export interface IConsumeIntentRequest {
  intentId: string;
  publicId: string;
  version: string;
}

export interface IDirectUploadResult {
  publicId: string;
  version: string;
}

export type UploadState =
  | { state: 'intent' }
  | { state: 'uploading'; progress: number }
  | { state: 'persisting' }
  | { state: 'complete'; media: IMediaResponse };

@Service()
export class MediaService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  generateIntent(
    resourceType: MediaResourceType,
    resourceId: string,
    role: string
  ): Observable<IUploadIntentResponse> {
    const route = ROUTE_MAP[resourceType];
    return this.#http.post<IUploadIntentResponse>(
      `${this.#apiUrl}/${route}/${resourceId}/media/upload-intent`,
      { role }
    );
  }

  performDirectUpload(
    intent: IUploadIntentResponse,
    file: File
  ): Observable<{ type: 'progress'; value: number } | { type: 'result'; value: IDirectUploadResult }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', intent.timestamp.toString());
    formData.append('signature', intent.signature);
    formData.append('folder', intent.folder);
    formData.append('public_id', intent.publicId);
    if (intent.apiKey) {
      formData.append('api_key', intent.apiKey);
    }

    // Default to a fallback if cloudName isn't provided, though backend should provide it for Cloudinary
    const cloudName = intent.cloudName || 'dlyxyhofo';
    const uploadUrl = `${environment.cloudinaryUploadBaseUrl}/${cloudName}/auto/upload`;

    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
    });

    return this.#http.request<any>(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
          return { type: 'progress', value: progress };
        } else if (event.type === HttpEventType.Response) {
          return {
            type: 'result',
            value: {
              publicId: event.body.public_id,
              version: event.body.version.toString(),
            },
          };
        }
        return { type: 'progress', value: 0 };
      })
    );
  }

  consumeIntent(
    resourceType: MediaResourceType,
    resourceId: string,
    payload: IConsumeIntentRequest
  ): Observable<IMediaResponse> {
    const route = ROUTE_MAP[resourceType];
    return this.#http.post<IMediaResponse>(
      `${this.#apiUrl}/${route}/${resourceId}/media`,
      payload
    );
  }

  uploadMedia(
    resourceType: MediaResourceType,
    resourceId: string,
    role: string,
    file: File
  ): Observable<UploadState> {
    return new Observable<UploadState>((observer) => {
      observer.next({ state: 'intent' });

      const subscription = this.generateIntent(resourceType, resourceId, role).pipe(
        switchMap((intent) => {
          return this.performDirectUpload(intent, file).pipe(
            switchMap((uploadEvent) => {
              if (uploadEvent.type === 'progress') {
                return of<UploadState>({ state: 'uploading', progress: uploadEvent.value });
              } else if (uploadEvent.type === 'result') {
                return concat(
                  of<UploadState>({ state: 'persisting' }),
                  this.consumeIntent(resourceType, resourceId, {
                    intentId: intent.intentId,
                    publicId: uploadEvent.value.publicId,
                    version: uploadEvent.value.version,
                  }).pipe(
                    map((media) => ({ state: 'complete', media } as UploadState))
                  )
                );
              }
              // Ignore other HttpEvent types safely
              return of<UploadState>({ state: 'uploading', progress: 0 });
            })
          );
        })
      ).subscribe({
        next: (state) => {
          // Prevent duplicates or noise (like 0% immediately after 0%)
          observer.next(state);
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  deleteMedia(mediaId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/media/${mediaId}`);
  }
}
