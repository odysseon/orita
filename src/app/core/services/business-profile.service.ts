import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface PublicationIssue {
  code: string;
  severity: 'ERROR' | 'WARNING';
  message: string;
}

export interface PublicationReadinessResult {
  ready: boolean;
  issues: PublicationIssue[];
}

@Injectable({ providedIn: 'root' })
export class BusinessProfileService {
  #http = inject(HttpClient);

  async publish(businessId: string): Promise<void> {
    await firstValueFrom(
      this.#http.post(`${environment.apiUrl}/business/${businessId}/publish`, {})
    );
  }

  async unpublish(businessId: string): Promise<void> {
    await firstValueFrom(
      this.#http.post(`${environment.apiUrl}/business/${businessId}/unpublish`, {})
    );
  }

  async checkReadiness(businessId: string): Promise<PublicationReadinessResult> {
    return firstValueFrom(
      this.#http.get<PublicationReadinessResult>(
        `${environment.apiUrl}/business/${businessId}/publication-readiness`
      )
    );
  }
}
