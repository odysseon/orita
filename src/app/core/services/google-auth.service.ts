/// <reference types="google.accounts" />
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class GoogleAuthService {
  #http = inject(HttpClient);
  private isInitialized = false;
  private isFetching = false;
  private callbacks = new Set<(response: google.accounts.id.CredentialResponse) => void>();
  
  public readonly initialized$ = new BehaviorSubject<boolean>(false);

  initialize(callback: (response: google.accounts.id.CredentialResponse) => void) {
    this.callbacks.add(callback);

    if (this.isInitialized) {
      return;
    }
    
    if (this.isFetching) {
      return;
    }
    
    if (typeof window === 'undefined' || !window.google) {
      return;
    }

    this.isFetching = true;
    this.#http.get<{ clientId: string }>(`${environment.apiUrl}/auth/google/client-id`).subscribe({
      next: (res) => {
        if (!res.clientId) return;
        google.accounts.id.initialize({
          client_id: res.clientId,
          callback: (response) => {
            this.callbacks.forEach((cb) => cb(response));
          },
        });
        this.isInitialized = true;
        this.isFetching = false;
        this.initialized$.next(true);
      },
      error: () => {
        // Silently fail or retry, but prevent locking
        this.isFetching = false;
      }
    });
  }

  unregister(callback: (response: google.accounts.id.CredentialResponse) => void) {
    this.callbacks.delete(callback);
  }

  getIdTokenFromCredentialResponse(response: google.accounts.id.CredentialResponse): string {
    if (!response.credential) {
      throw new Error('Could not get Google credentials. Please try again.');
    }
    return response.credential;
  }
}
