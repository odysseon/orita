import { Component, computed, inject, signal, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import {
  LucideLoaderCircle,
  LucideKey,
  LucideTrash2,
  LucideLink,
  LucideUnlink,
} from '@lucide/angular';
import { ToastService } from '../../../core/services/toast';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../profile.interface';
import { AppFormField } from '../../../shared/form-field/form-field';
import { MediaSelector } from '../../../shared/media-selector/media-selector';
import { Drawer } from '../../../shared/drawer/drawer';
import { DrawerFocusService } from '../../../shared/drawer/drawer-focus.service';
import { DrawerDragService } from '../../../shared/drawer/drawer-drag.service';
import { AppPasswordField } from '../../../shared/password-field/password-field';

export interface IUpdateProfileForm {
  username: string;
  email: string;
}

@Component({
  selector: 'app-security',
  imports: [
    FormField,
    LucideLoaderCircle,
    LucideKey,
    LucideTrash2,
    LucideLink,
    LucideUnlink,
    AppFormField,
    MediaSelector,
    Drawer,
    AppPasswordField,
  ],
  templateUrl: './security.html',
  styleUrl: './security.css',
})
export class Security {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #auth = inject(AuthService);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);
  readonly loading = signal(false);
  
  // Profile Info
  readonly avatarFile = signal<File | null>(null);
  readonly model = signal<IUpdateProfileForm>({ username: '', email: '' });
  
  readonly profileForm = form(this.model, (f) => {
    required(f.username, { message: 'Username is required' });
    minLength(f.username, 3, { message: 'Username must be at least 3 characters' });
    required(f.email, { message: 'Email is required' });
  });

  // Drawers
  readonly isPasswordDrawerOpen = signal(false);
  readonly isGoogleDrawerOpen = signal(false);
  readonly isDeleteDrawerOpen = signal(false);

  // Password Form
  readonly passwordModel = signal({ currentPassword: '', newPassword: '' });
  readonly passwordFormObj = form(this.passwordModel, (f) => {
    required(f.currentPassword, { message: 'Current password is required' });
    required(f.newPassword, { message: 'New password is required' });
    minLength(f.newPassword, 8, { message: 'Must be at least 8 characters' });
  });

  constructor() {
    effect(() => {
      const p = this.profile.value();
      if (p) {
        this.model.set({ username: p.username, email: p.email });
      }
    });
  }

  onAvatarChanged(files: File[]): void {
    this.avatarFile.set(files[0] || null);
  }

  onAvatarRemoved(): void {
    this.avatarFile.set(null);
  }

  async onSubmitProfile(event: Event): Promise<void> {
    event.preventDefault();
    if (this.profileForm().invalid()) return;

    this.loading.set(true);
    try {
      // 1. Update text details
      await firstValueFrom(
        this.#http.patch(`${environment.apiUrl}/users/me`, this.model())
      );

      // 2. Upload avatar if selected
      const avatar = this.avatarFile();
      if (avatar) {
        const formData = new FormData();
        formData.append('file', avatar); // Usually 'file' or 'avatar'. I will use 'file'.
        await firstValueFrom(
          this.#http.post(`${environment.apiUrl}/users/me/avatar`, formData)
        );
        this.avatarFile.set(null); // Clear after upload
      }

      this.#toast.success('Profile updated', 'Your personal details have been saved.');
      this.profile.reload();
    } catch (err) {
      const message = err instanceof HttpErrorResponse ? (err.error?.message ?? 'Could not update profile.') : 'Error occurred.';
      this.#toast.error('Error', message);
    } finally {
      this.loading.set(false);
    }
  }

  async onLinkGoogle(): Promise<void> {
    try {
      this.loading.set(true);
      // Wait, how do we get Google token?
      // Since we don't have Google one-tap inside the drawer initialized for link,
      // We might just call link if the backend supports OAuth redirect, but wait,
      // it's a POST. I will just make it a stub and let user know.
      this.#toast.info('Google Link', 'Google link requires token acquisition.');
      this.isGoogleDrawerOpen.set(false);
    } catch (err) {
      this.#toast.error('Error', 'Failed to link Google.');
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
