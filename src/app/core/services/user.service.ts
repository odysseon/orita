import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http = inject(HttpClient);

  async updateInterests(categoryIds: string[]): Promise<void> {
    await firstValueFrom(
      this.#http.put(`${environment.apiUrl}/users/me/interests`, { categoryIds })
    );
  }
}
