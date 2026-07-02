/// <reference types="google.accounts" />
import { Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class GoogleAuthService {
  private isInitialized = false;
  private callbacks = new Set<(response: google.accounts.id.CredentialResponse) => void>();

  initialize(callback: (response: google.accounts.id.CredentialResponse) => void) {
    this.callbacks.add(callback);

    if (this.isInitialized) return;
    if (typeof window === 'undefined' || !window.google || !environment.googleClientId) {
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        this.callbacks.forEach((cb) => cb(response));
      },
    });
    this.isInitialized = true;
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
