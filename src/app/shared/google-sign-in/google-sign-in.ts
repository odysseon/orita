/// <reference types="google.accounts" />
import { Component, ElementRef, ViewChild, AfterViewInit, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-google-sign-in',
  standalone: true,
  template: `
    <div class="google-sign-in-container">
      <div #googleBtnRef></div>
    </div>
  `,
  styles: [
    `
      .google-sign-in-container {
        display: flex;
        justify-content: center;
        margin: 1rem 0;
      }
    `,
  ],
})
export class AppGoogleSignIn implements AfterViewInit {
  @ViewChild('googleBtnRef') googleBtnRef!: ElementRef<HTMLDivElement>;

  #auth = inject(AuthService);

  ngAfterViewInit() {
    // Only initialize if the global google object is loaded and clientId is configured
    if (typeof window !== 'undefined' && window.google && environment.googleClientId) {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: google.accounts.id.CredentialResponse) =>
          this.handleCredentialResponse(response),
      });
      google.accounts.id.renderButton(this.googleBtnRef.nativeElement, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        width: 320,
      });
    } else {
      console.warn('Google Sign-In script not loaded or Client ID is missing.');
    }
  }

  private handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
    if (response.credential) {
      this.#auth.loginWithGoogle(response.credential);
    }
  }
}
