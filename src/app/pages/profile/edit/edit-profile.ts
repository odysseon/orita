import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required, minLength, email } from '@angular/forms/signals';
import { LucideLoaderCircle } from '@lucide/angular';
import { ToastService } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../profile.interface';
import { AppFormField } from '../../../shared/form-field/form-field';
import { MediaSelector } from '../../../shared/media-selector/media-selector';

interface IEditProfileForm {
  username: string;
  email: string;
}

@Component({
  selector: 'app-edit-profile',
  imports: [FormField, LucideLoaderCircle, AppFormField, MediaSelector],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  #http = inject(HttpClient);
  #toast = inject(ToastService);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);
  readonly loading = signal(false);
  readonly avatarFile = signal<File | null>(null);

  readonly model = signal<IEditProfileForm>({ username: '', email: '' });

  readonly profileForm = form(this.model, (f) => {
    required(f.username, { message: 'Username is required' });
    minLength(f.username, 3, { message: 'Username must be at least 3 characters' });
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email address' });
  });

  constructor() {
    effect(() => {
      const profile = this.profile.value();
      if (profile) {
        this.model.set({ username: profile.username, email: profile.email });
      }
    });
  }

  onAvatarChanged(files: File[]): void {
    this.avatarFile.set(files[0] ?? null);
  }

  onAvatarRemoved(): void {
    this.avatarFile.set(null);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.profileForm().invalid()) return;

    this.loading.set(true);
    try {
      await firstValueFrom(this.#http.patch(`${environment.apiUrl}/users/me`, this.model()));

      const avatar = this.avatarFile();
      if (avatar) {
        const formData = new FormData();
        formData.append('file', avatar);
        await firstValueFrom(this.#http.post(`${environment.apiUrl}/users/me/avatar`, formData));
        this.avatarFile.set(null);
      }

      this.#toast.success('Profile updated', 'Your personal details have been saved.');
      this.profile.reload();
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? 'Could not update profile.')
          : 'An unexpected error occurred.';
      this.#toast.error('Error', message);
    } finally {
      this.loading.set(false);
    }
  }
}
