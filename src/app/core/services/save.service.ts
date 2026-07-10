import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Service()
export class SaveService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;



  toggleSaveListing(id: string, currentlySaved: boolean): Observable<any> {
    const url = `${this.#apiUrl}/listings/${id}/save`;
    return currentlySaved ? this.#http.delete(url) : this.#http.post(url, {});
  }
}
