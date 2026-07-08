import { Component, input, inject, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { LucideMapPin, LucideChevronDown } from '@lucide/angular';
import { ExplorationService } from '../../core/services/exploration.service';
import { ActiveLocation } from '../../core/services/exploration-storage';
import { Drawer } from '../drawer/drawer';
import { LocationSelector } from '../location-selector/location-selector';
import { LocationSuggestion } from '../../core/services/location.service';

@Component({
  selector: 'ui-app-header',
  imports: [
    Logo,
    LucideMapPin,
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
  readonly showLocationDrawer = signal(false);

  toggleDrawer() {
    this.showLocationDrawer.update(v => !v);
  }

  selectLocation(result: LocationSuggestion) {
    const context: ActiveLocation = {
      id: `geo_${result.lat}_${result.lng}`,
      name: result.address || result.displayName,
      city: null,
      state: null,
      country: null,
      lat: result.lat,
      lng: result.lng,
    };
    
    this.#exploration.setLocation(context);
    this.showLocationDrawer.set(false);
  }
}
