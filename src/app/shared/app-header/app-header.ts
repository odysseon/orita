import { Component, input, inject, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { LucideChevronDown } from '@lucide/angular';
import { ExplorationService } from '../../core/services/exploration.service';
import { ActiveLocation } from '../../core/services/exploration-storage';
import { Drawer } from '../drawer/drawer';
import { LocationSelector } from '../location-selector/location-selector';
import { Location } from '../../core/services/location.service';

@Component({
  selector: 'ui-app-header',
  imports: [
    Logo,
    LucideChevronDown,
    Drawer,
    LocationSelector,
  ],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
  host: {
    '[class.layout-wide]': 'layout() === "wide"'
  }
})
export class AppHeader {
  readonly showLogo = input<boolean>(true);
  readonly showLocationPill = input<boolean>(true);
  readonly layout = input<'default' | 'wide'>('default');

  #exploration = inject(ExplorationService);

  readonly activeLocation = this.#exploration.activeLocation;
  readonly isLocationPickerOpen = this.#exploration.isLocationPickerOpen;

  toggleDrawer() {
    this.isLocationPickerOpen.update(v => !v);
  }

  selectLocation(result: Location) {
    const context: ActiveLocation = {
      id: `geo_${result.latitude}_${result.longitude}`,
      name: result.formattedAddress || result.name,
      city: null,
      state: null,
      country: null,
      lat: result.latitude,
      lng: result.longitude,
    };
    
    this.#exploration.setLocation(context);
    this.isLocationPickerOpen.set(false);
  }
}
