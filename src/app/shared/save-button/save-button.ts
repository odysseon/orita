import { Component, input, model, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LucideBookmark } from '@lucide/angular';
import { ToastService } from '../../core/services/toast';
import { environment } from '../../../environments/environment';

export type SaveItemType = 'BUSINESS' | 'LISTING' | 'TOUR';

@Component({
  selector: 'app-save-button',
  imports: [LucideBookmark],
  templateUrl: './save-button.html',
  styleUrl: './save-button.css',
})
export class SaveButton {
  readonly itemId = input.required<string>();
  readonly itemType = input.required<SaveItemType>();
  readonly saved = model<boolean>(false);

  // Style configurations
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'icon' | 'action' | 'overlay'>(
    'icon',
  );
  readonly label = input<string>('Save');

  readonly saving = signal(false);

  #http = inject(HttpClient);
  #toast = inject(ToastService);

  async onToggle(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (this.saving()) return;
    this.saving.set(true);

    const currentlySaved = this.saved();
    // Optimistic update
    this.saved.set(!currentlySaved);

    try {
      const endpoint = this.getEndpoint();
      if (currentlySaved) {
        await firstValueFrom(this.#http.delete(endpoint));
        this.#toast.info('Removed from saved');
      } else {
        await firstValueFrom(this.#http.post(endpoint, {}));
        this.#toast.success('Saved');
      }
    } catch {
      // Revert on failure
      this.saved.set(currentlySaved);
      this.#toast.error('Could not update saved status');
    } finally {
      this.saving.set(false);
    }
  }

  private getEndpoint(): string {
    const id = this.itemId();
    switch (this.itemType()) {
      case 'BUSINESS':
        return `${environment.apiUrl}/business-profiles/${id}/save`;
      case 'LISTING':
        return `${environment.apiUrl}/listings/${id}/save`;
      case 'TOUR':
        return `${environment.apiUrl}/business-tours/${id}/save`;
      default:
        throw new Error(`Unknown save item type: ${this.itemType()}`);
    }
  }
}
