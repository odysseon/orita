import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPaginated } from '../../pages/home/home.interface';

export enum BusinessTourStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface IBusinessTourHighlight {
  id: string;
  value: string;
}

export interface IBusinessTourMediaItem {
  id: string;
  url: string;
  mediaType: 'IMAGE' | 'VIDEO';
  order: number | null;
  createdAt: string;
}

export interface IBusinessTour {
  id: string;
  businessProfileId: string;
  title: string;
  summary: string | null;
  visitDate: string;
  status: BusinessTourStatus;
  publishedAt: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  highlights: IBusinessTourHighlight[];
  media: IBusinessTourMediaItem[];
}

export interface CreateBusinessTourDto {
  title: string;
  summary?: string;
  visitDate: string;
  highlights?: string[];
}

export interface UpdateBusinessTourDto {
  title?: string;
  summary?: string | null;
  visitDate?: string;
  highlights?: string[];
  status?: BusinessTourStatus;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessTourService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  create(businessProfileId: string, dto: CreateBusinessTourDto): Observable<IBusinessTour> {
    return this.#http.post<IBusinessTour>(`${this.#apiUrl}/business-profiles/${businessProfileId}/business-tours`, dto);
  }

  update(id: string, dto: UpdateBusinessTourDto): Observable<IBusinessTour> {
    return this.#http.patch<IBusinessTour>(`${this.#apiUrl}/business-tours/${id}`, dto);
  }

  get(id: string): Observable<IBusinessTour> {
    return this.#http.get<IBusinessTour>(`${this.#apiUrl}/business-tours/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/business-tours/${id}`);
  }

  listByBusiness(businessProfileId: string, params?: { page?: number; limit?: number; status?: BusinessTourStatus }): Observable<IPaginated<IBusinessTour>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);
    if (params?.status) httpParams = httpParams.set('status', params.status);

    return this.#http.get<IPaginated<IBusinessTour>>(`${this.#apiUrl}/business-profiles/${businessProfileId}/business-tours`, { params: httpParams });
  }

  discoverGlobal(params?: { page?: number; limit?: number; status?: BusinessTourStatus; search?: string; lat?: number; lng?: number; radius?: number }): Observable<IPaginated<IBusinessTour>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.lat) httpParams = httpParams.set('lat', params.lat);
    if (params?.lng) httpParams = httpParams.set('lng', params.lng);
    if (params?.radius) httpParams = httpParams.set('radius', params.radius);

    return this.#http.get<IPaginated<IBusinessTour>>(`${this.#apiUrl}/business-tours`, { params: httpParams });
  }
}
