/// <reference types="google.accounts" />
import { Component, ElementRef, AfterViewInit, inject, input, output, viewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.html',
  styleUrl: './google-sign-in.css',
})
export class AppGoogleSignIn implements AfterViewInit, OnDestroy {
  googleBtnRef = viewChild.required<ElementRef<HTMLDivElement>>('googleBtnRef');
  autoLogin = input(true);
  idTokenReceived = output<string>();

  #auth = inject(AuthService);
  #googleAuth = inject(GoogleAuthService);
  private initSub?: Subscription;

  private credentialCallback = (response: google.accounts.id.CredentialResponse) => {
    this.handleCredentialResponse(response);
  };

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && window.google) {
      this.#googleAuth.initialize(this.credentialCallback);
      
      this.initSub = this.#googleAuth.initialized$.subscribe((isReady) => {
        if (!isReady) return;
        
        const wrapper = this.googleBtnRef().nativeElement;
        const computedWidth = getComputedStyle(wrapper).getPropertyValue('--google-btn-width');
        const width = computedWidth ? parseInt(computedWidth.trim(), 10) : 320;

        google.accounts.id.renderButton(wrapper, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          width: width,
        });
      });
    } else {
      console.warn('Google Sign-In script not loaded.');
    }
  }

  ngOnDestroy() {
    this.initSub?.unsubscribe();
    this.#googleAuth.unregister(this.credentialCallback);
  }

  private handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
    const idToken = this.#googleAuth.getIdTokenFromCredentialResponse(response);
    this.idTokenReceived.emit(idToken);
    if (this.autoLogin()) {
      this.#auth.loginWithGoogle(idToken);
    }
  }
}
