import { Component, output, inject, signal, input } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';
import { LocationService, Location } from '../../../../core/services/location.service';
import { firstValueFrom } from 'rxjs';
import { Button } from '@odysseon/ur-ui';

@Component({
  selector: 'ui-location-gps-button',
  standalone: true,
  imports: [LucideMapPin, Button],
  template: `
    <button
      app-button
      intent="primary"
      appearance="solid"
      [fullWidth]="true"
      [loading]="isLocating()"
      (click)="useCurrentLocation()"
    >
      <svg lucideMapPin aria-hidden="true"></svg>
      {{ isLocating() ? loadingLabel() : label() }}
    </button>
  `
})
export class LocationGpsButton {
  readonly locationSelected = output<Location>();
  readonly label = input<string>('Use my current location');
  readonly loadingLabel = input<string>('Locating...');

  #locationService = inject(LocationService);
  readonly isLocating = signal(false);

  async useCurrentLocation() {
    this.isLocating.set(true);
    try {
      const pos = await this.#locationService.getCurrentPosition();
      const suggestion = await firstValueFrom(
        this.#locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      );
      if (suggestion) {
        this.locationSelected.emit(suggestion);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLocating.set(false);
    }
  }
}
