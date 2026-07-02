/// <reference types="google.accounts" />
import { Component, inject, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required } from '@angular/forms/signals';
import {
  LucideKey,
  LucideTrash2,
  LucideLink,
  LucideUnlink,
  LucideEye,
  LucideEyeOff,
} from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../profile.interface';
import { Drawer } from '../../../shared/drawer/drawer';
import { AppFormField } from '../../../shared/form-field/form-field';
import { AppGoogleSignIn } from '../../../shared/google-sign-in/google-sign-in';
import { ValidationService } from '../../../core/services/validation.service';

interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

interface IAddPassword {
  password: string;
}

@Component({
  selector: 'app-security',
  imports: [
    FormField,
    RouterLink,
    LucideKey,
    LucideTrash2,
    LucideLink,
    LucideUnlink,
    LucideEye,
    LucideEyeOff,
    Drawer,
    AppFormField,
    AppGoogleSignIn,
  ],
  templateUrl: './security.html',
  styleUrl: './security.css',
})
export class Security {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #validation = inject(ValidationService);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);
  readonly loading = signal(false);

  readonly hasPassword = computed(() => this.profile.value()?.hasPassword ?? false);

  // Drawers
  readonly isPasswordDrawerOpen = signal(false);
  readonly isGoogleDrawerOpen = signal(false);

  // Password visibility toggles
  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly showAddPassword = signal(false);

  // Models for Signal Forms
  readonly changePasswordModel = signal<IChangePassword>({
    currentPassword: '',
    newPassword: '',
  });

  readonly addPasswordModel = signal<IAddPassword>({
    password: '',
  });

  // Signal Forms
  readonly changePasswordForm = form(this.changePasswordModel, (f) => {
    required(f.currentPassword, { message: 'Current password is required' });
    this.#validation.validatePassword(f.newPassword);
  });

  readonly addPasswordForm = form(this.addPasswordModel, (f) => {
    this.#validation.validatePassword(f.password);
  });

  constructor() {
    effect(() => {
      const isOpen = this.isPasswordDrawerOpen();
      if (!isOpen) {
        // Reset models
        this.changePasswordModel.set({ currentPassword: '', newPassword: '' });
        this.addPasswordModel.set({ password: '' });

        // Reset form signals state
        this.changePasswordForm().reset();
        this.addPasswordForm().reset();

        // Reset visibility toggles
        this.showCurrentPassword.set(false);
        this.showNewPassword.set(false);
        this.showAddPassword.set(false);
      }
    });
  }

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

    if (this.hasPassword()) {
      if (this.changePasswordForm().invalid()) {
        this.changePasswordForm().markAsTouched();
        return;
      }
      this.loading.set(true);
      try {
        await firstValueFrom(
          this.#http.post(
            `${environment.apiUrl}/auth/password/change`,
            this.changePasswordModel(),
          ),
        );
        this.#toast.success('Success', 'Password has been changed.');
        this.isPasswordDrawerOpen.set(false);
      } catch (err) {
        const message =
          err instanceof HttpErrorResponse
            ? (err.error?.message ?? 'Could not change password.')
            : 'Could not change password.';
        this.#toast.error('Error', message);
      } finally {
        this.loading.set(false);
      }
    } else {
      if (this.addPasswordForm().invalid()) {
        this.addPasswordForm().markAsTouched();
        return;
      }
      this.loading.set(true);
      try {
        await firstValueFrom(
          this.#http.post(
            `${environment.apiUrl}/auth/password/add`,
            this.addPasswordModel(),
          ),
        );
        this.#toast.success('Success', 'Password has been added.');
        this.isPasswordDrawerOpen.set(false);
        this.profile.reload(); // needed so hasPassword() flips to true afterward
      } catch (err) {
        const message =
          err instanceof HttpErrorResponse
            ? (err.error?.message ?? 'Could not add password.')
            : 'Could not add password.';
        this.#toast.error('Error', message);
      } finally {
        this.loading.set(false);
      }
    }
  }

  onDeleteAccount(): void {
    this.#toast.info('Not available', 'Account deletion is currently disabled.');
  }
}
