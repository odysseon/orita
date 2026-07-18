import { Component, input, inject, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { LucideChevronDown, LucideMapPin, LucideUser, LucideLogIn } from '@lucide/angular';
import { ExplorationService } from '../../core/services/exploration.service';
import { ActiveLocation } from '../../core/services/exploration-storage';
import { Drawer } from '../drawer/drawer';
import { LocationSelector } from '../location-selector/location-selector';
import { Location } from '../../core/services/location.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-app-header',
  imports: [
    Logo,
    LucideChevronDown,
    LucideMapPin,
    LucideUser,
    LucideLogIn,
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
  readonly pageTitle = input<string>();
  readonly showLocationPill = input<boolean>(false);
  readonly layout = input<'default' | 'wide'>('default');

  #exploration = inject(ExplorationService);
  readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  #router = inject(Router);

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

  goToProfile() {
    if (this.authService.token()) {
      this.#router.navigate(['/profile']);
    } else {
      this.#router.navigate(['/auth/login']);
    }
  }
}
