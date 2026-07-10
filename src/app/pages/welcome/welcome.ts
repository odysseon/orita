import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideCompass, LucideStore } from '@lucide/angular';
import { LocationSelector } from '../../shared/location-selector/location-selector';
import { Location } from '../../core/services/location.service';
import { ExplorationService } from '../../core/services/exploration.service';
import { ActiveLocation } from '../../core/services/exploration-storage';
import { SeoComponent } from '../../shared/seo/seo.component';
import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-welcome',
  imports: [LucideCompass, LucideStore, LocationSelector, SeoComponent, Logo],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  #router = inject(Router);
  #exploration = inject(ExplorationService);
  
  readonly seoConfig = {
    title: 'Welcome to Oríta',
    description: 'Discover the world around you or build your business on Oríta.',
  };

  showLocationPicker = false;

  onExplore() {
    this.showLocationPicker = true;
  }

  onCreateBusiness() {
    this.#router.navigate(['/profile/business'], {
      queryParams: { action: 'create' },
    });
  }

  onLocationSelected(result: Location) {
    const context: ActiveLocation = {
      id: `geo_${result.latitude}_${result.longitude}`,
      name: result.name || result.formattedAddress || 'Unknown',
      city: result.formattedAddress || null,
      state: null,
      country: null,
      lat: result.latitude,
      lng: result.longitude,
    };
    
    this.#exploration.setLocation(context);
    this.#router.navigate(['/home']);
  }
}
