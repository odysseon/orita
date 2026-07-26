import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { PublicationReadinessResult } from './business-profile.service';

@Service()
export class ListingService {
  #http = inject(HttpClient);

  async checkReadiness(listingId: string): Promise<PublicationReadinessResult> {
    return firstValueFrom(
      this.#http.get<PublicationReadinessResult>(
        `${environment.apiUrl}/listings/${listingId}/publication-readiness`,
      ),
    );
  }
}
