import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NearbyQueryParams, NearbyResultPageDto } from '../models/discovery';

@Service()
export class DiscoveryService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  getNearby(params: NearbyQueryParams): Observable<NearbyResultPageDto> {
    const queryObj: any = {
      lat: params.lat.toString(),
      lng: params.lng.toString(),
    };
    if (params.radiusKm) queryObj.radiusKm = params.radiusKm.toString();
    if (params.limit) queryObj.limit = params.limit.toString();
    if (params.cursorScore) queryObj.cursorScore = params.cursorScore.toString();
    if (params.cursorId) queryObj.cursorId = params.cursorId;
    if (params.types && params.types.length > 0) queryObj.types = params.types.join(',');

    return this.#http.get<NearbyResultPageDto>(`${this.#apiUrl}/nearby`, { params: queryObj });
  }
}
