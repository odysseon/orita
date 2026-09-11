import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required, minLength, email } from '@angular/forms/signals';
import { LucideLoaderCircle } from '@lucide/angular';
import { ToastService } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../profile.interface';
import { AppFormField } from 'ur-ui';
import { Button } from 'ur-ui';
import { MediaSelector } from '../../../shared/media-selector/media-selector';
import { MediaService } from '../../../core/services/media.service';

interface IEditProfileForm {
  username: string;
}

@Component({
  selector: 'app-edit-profile',
  imports: [FormField, AppFormField, LucideLoaderCircle, AppFormField, MediaSelector],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  #http = inject(HttpClient);
  #toast = inject(ToastService);
  #media = inject(MediaService);
  #router = inject(Router);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);
  readonly loading = signal(false);
  readonly avatarFile = signal<File | null>(null);

  readonly model = signal<IEditProfileForm>({ username: '' });

  readonly profileForm = form(this.model, (f) => {
    required(f.username, { message: 'Username is required' });
    minLength(f.username, 3, { message: 'Username must be at least 3 characters' });
  });

  constructor() {
    effect(() => {
      const profile = this.profile.value();
      if (profile) {
        this.model.set({ username: profile.username });
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
    if (this.profileForm().invalid()) {
      this.profileForm().markAsTouched();
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.#http.patch(`${environment.apiUrl}/users/me`, this.model()));

      const avatar = this.avatarFile();
      if (avatar) {
        await new Promise<void>((resolve, reject) => {
          this.#media.uploadMedia('user-profile', '', 'AVATAR', avatar).subscribe({
            next: (state) => {
              // Intentionally swallowing state updates for now, showing global 'Saving...' loader.
            },
            error: (err) => reject(err),
            complete: () => resolve(),
          });
        });
        this.avatarFile.set(null);
      }

      this.#toast.success('Profile updated', 'Your personal details have been saved.');
      this.profile.reload();
      this.#router.navigate(['/profile']);
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
