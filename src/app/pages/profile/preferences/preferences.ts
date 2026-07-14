import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideSave } from '@lucide/angular';
import { CategoryBrowser } from '../../../shared/category-browser/category-browser';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast';
import { Profile } from '../profile';

@Component({
  selector: 'app-profile-preferences',
  imports: [CommonModule, LucideSave, CategoryBrowser],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class ProfilePreferences {
  #userService = inject(UserService);
  #toast = inject(ToastService);
  #profileParent = inject(Profile);

  readonly selectedIds = signal<string[]>([]);
  readonly isSaving = signal(false);
  readonly hasChanges = signal(false);

  constructor() {
    const profileData = this.#profileParent.profile.value();
    if (profileData && profileData.interestedCategories) {
      this.selectedIds.set([...profileData.interestedCategories]);
    }
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
      this.#profileParent.profile.reload();
    } catch (err) {
      this.#toast.error('Error', 'Failed to save preferences. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
