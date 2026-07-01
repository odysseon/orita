/// <reference types="google.accounts" />
import { Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class GoogleAuthService {
  getIdTokenFromCredentialResponse(response: google.accounts.id.CredentialResponse): string {
    if (!response.credential) {
      throw new Error('Could not get Google credentials. Please try again.');
    }
    return response.credential;
  }

  requestIdToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.google || !environment.googleClientId) {
        reject(new Error('Google Sign-In is not available right now.'));
        return;
      }

      let settled = false;
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: google.accounts.id.CredentialResponse) => {
          if (settled) return;
          try {
            const idToken = this.getIdTokenFromCredentialResponse(response);
            settled = true;
            resolve(idToken);
          } catch (error) {
            settled = true;
            reject(error);
          }
        },
      });
    });
  }
}
