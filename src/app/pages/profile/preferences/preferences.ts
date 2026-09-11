import { Component, inject, signal, effect } from '@angular/core';
import { LucideSave } from '@lucide/angular';
import { CategoryBrowser } from '../../../shared/ui/organisms/category-browser/category-browser';
import { Button } from 'ur-ui';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IProfile } from '../profile.interface';

@Component({
  selector: 'app-profile-preferences',
  imports: [LucideSave, CategoryBrowser],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class ProfilePreferences {
  #userService = inject(UserService);
  #toast = inject(ToastService);

  readonly profile = httpResource<IProfile>(() => `${environment.apiUrl}/users/me`);

  readonly selectedIds = signal<string[]>([]);
  readonly isSaving = signal(false);
  readonly hasChanges = signal(false);

  constructor() {
    effect(() => {
      const p = this.profile.value();
      if (p?.interestedCategories && !this.hasChanges()) {
        this.selectedIds.set([...p.interestedCategories]);
      }
    });
  }

  onSelectionChange(newSelection: string[]) {
    this.selectedIds.set(newSelection);
    this.hasChanges.set(true);
  }

  async saveChanges() {
    if (this.isSaving()) return;
    
    this.isSaving.set(true);
    try {
      await this.#userService.updateInterests(this.selectedIds());
      this.#toast.success('Preferences saved', 'Your discovery feed has been updated.');
      this.hasChanges.set(false);
      this.profile.reload();
    } catch (err) {
      this.#toast.error('Error', 'Failed to save preferences. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
