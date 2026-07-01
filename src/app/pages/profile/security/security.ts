import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { form, required, minLength } from '@angular/forms/signals';
import {
  LucideKey,
  LucideTrash2,
  LucideLink,
  LucideUnlink,
} from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../profile.interface';
import { Drawer } from '../../../shared/drawer/drawer';
import { AppPasswordField } from '../../../shared/password-field/password-field';
import { AppGoogleSignIn } from '../../../shared/google-sign-in/google-sign-in';

@Component({
  selector: 'app-security',
  imports: [
    RouterLink,
    LucideKey,
    LucideTrash2,
    LucideLink,
    LucideUnlink,
    Drawer,
    AppPasswordField,
    AppGoogleSignIn,
  ],
  templateUrl: './security.html',
  styleUrl: './security.css',
})
export class Security {
  #http = inject(HttpClient);
  #toast = inject(ToastService);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);
  readonly loading = signal(false);

  // Drawers
  readonly isPasswordDrawerOpen = signal(false);
  readonly isGoogleDrawerOpen = signal(false);

  // Password Form
  readonly passwordModel = signal({ currentPassword: '', newPassword: '' });
  readonly passwordFormObj = form(this.passwordModel, (f) => {
    required(f.currentPassword, { message: 'Current password is required' });
    required(f.newPassword, { message: 'New password is required' });
    minLength(f.newPassword, 8, { message: 'Must be at least 8 characters' });
  });

  async onGoogleIdTokenReceived(idToken: string): Promise<void> {
    try {
      this.loading.set(true);
      await firstValueFrom(this.#http.post(`${environment.apiUrl}/auth/google/link`, { idToken }));
      this.#toast.success('Linked', 'Google account has been linked.');
      this.profile.reload();
      this.isGoogleDrawerOpen.set(false);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Failed to link Google.')
          : err instanceof Error
            ? err.message
            : 'Failed to link Google.';
      this.#toast.error('Error', message);
    } finally {
      this.loading.set(false);
    }
  }

  async onUnlinkGoogle(): Promise<void> {
    try {
      this.loading.set(true);
      await firstValueFrom(this.#http.delete(`${environment.apiUrl}/auth/google/unlink`));
      this.#toast.success('Unlinked', 'Google account has been unlinked.');
      this.isGoogleDrawerOpen.set(false);
      this.profile.reload();
    } catch (err) {
      this.#toast.error('Error', 'Failed to unlink Google.');
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmitPassword(event: Event): Promise<void> {
    event.preventDefault();
    if (this.passwordFormObj().invalid()) return;
    
    this.loading.set(true);
    try {
      // Assuming a standard change password endpoint
      await firstValueFrom(this.#http.patch(`${environment.apiUrl}/users/me/password`, this.passwordModel()));
      this.#toast.success('Success', 'Password has been changed.');
      this.isPasswordDrawerOpen.set(false);
      this.passwordModel.set({ currentPassword: '', newPassword: '' });
    } catch (err) {
      this.#toast.error('Error', 'Could not change password.');
    } finally {
      this.loading.set(false);
    }
  }

  async onResetPassword(): Promise<void> {
    // If they only have Google auth, they can reset password
    this.loading.set(true);
    try {
      await firstValueFrom(this.#http.post(`${environment.apiUrl}/auth/reset-password`, { email: this.profile.value()?.email }));
      this.#toast.success('Email Sent', 'Check your email for reset instructions.');
      this.isPasswordDrawerOpen.set(false);
    } catch (err) {
      this.#toast.error('Error', 'Could not send reset email.');
    } finally {
      this.loading.set(false);
    }
  }

  onDeleteAccount(): void {
    // Disabled for now as per instructions
    this.#toast.info('Not available', 'Account deletion is currently disabled.');
  }
}
