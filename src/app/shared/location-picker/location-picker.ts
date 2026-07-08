import { Component, input, model, output, signal } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';
import { Drawer } from '../drawer/drawer';
import { LocationSelector } from '../location-selector/location-selector';
import { LocationSuggestion } from '../../core/services/location.service';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [Drawer, LocationSelector, LucideMapPin],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css',
})
export class LocationPicker {
  readonly open = model<boolean>(false);
  readonly triggerLabel = input<string>('Set Location');
  readonly currentAddress = input<string>();

  readonly confirmed = output<LocationSuggestion>();

  readonly provisional = signal<LocationSuggestion | null>(null);

  onProvisionalPick(loc: LocationSuggestion): void {
    this.provisional.set(loc);
  }

  confirm(): void {
    const loc = this.provisional();
    if (!loc) return;
    this.confirmed.emit(loc);
    this.provisional.set(null);
    this.open.set(false);
  }

  cancel(): void {
    this.provisional.set(null);
    this.open.set(false);
  }

  onDismissed(): void {
    this.provisional.set(null);
  }
}
