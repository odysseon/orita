import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return pattern.test(value) ? null : { weakPassword: true };
}

@Component({
  selector: 'app-security',
  imports: [
    ReactiveFormsModule,
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
  #fb = inject(FormBuilder);

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

  // Change Password Form
  readonly changePasswordForm = this.#fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Add Password Form
  readonly addPasswordForm = this.#fb.nonNullable.group({
    password: ['', [Validators.required, strongPasswordValidator]],
  });

  currentPasswordError(): string | undefined {
    const c = this.changePasswordForm.controls.currentPassword;
    if (c.errors?.['required']) return 'Current password is required';
    return undefined;
  }

  newPasswordError(): string | undefined {
    const c = this.changePasswordForm.controls.newPassword;
    if (c.errors?.['required']) return 'New password is required';
    if (c.errors?.['minlength']) return 'Must be at least 8 characters';
    return undefined;
  }

  addPasswordError(): string | undefined {
    const c = this.addPasswordForm.controls.password;
    if (c.errors?.['required']) return 'Password is required';
    if (c.errors?.['weakPassword']) {
      return 'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character.';
    }
    return undefined;
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
      if (this.changePasswordForm.invalid) {
        this.changePasswordForm.markAllAsTouched();
        return;
      }
      this.loading.set(true);
      try {
        await firstValueFrom(
          this.#http.post(
            `${environment.apiUrl}/auth/password/change`,
            this.changePasswordForm.getRawValue(),
          ),
        );
        this.#toast.success('Success', 'Password has been changed.');
        this.isPasswordDrawerOpen.set(false);
        this.changePasswordForm.reset();
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
      if (this.addPasswordForm.invalid) {
        this.addPasswordForm.markAllAsTouched();
        return;
      }
      this.loading.set(true);
      try {
        await firstValueFrom(
          this.#http.post(
            `${environment.apiUrl}/auth/password/add`,
            this.addPasswordForm.getRawValue(),
          ),
        );
        this.#toast.success('Success', 'Password has been added.');
        this.isPasswordDrawerOpen.set(false);
        this.addPasswordForm.reset();
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
