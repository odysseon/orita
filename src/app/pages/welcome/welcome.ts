import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LucideCompass, LucideStore, LucideGlobe } from '@lucide/angular';
import { LocationSelector } from '../../shared/location-selector/location-selector';
import { Location } from '../../core/services/location.service';
import { ExplorationService } from '../../core/services/exploration.service';
import { ActiveLocation } from '../../core/services/exploration-storage';
import { SeoComponent } from '../../shared/seo/seo.component';
import { Logo } from '../../shared/ui/atoms/logo/logo';
import { CategoryBrowser } from '../../shared/category-browser/category-browser';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-welcome',
  imports: [LucideCompass, LucideStore, LucideGlobe, LocationSelector, SeoComponent, Logo, CategoryBrowser],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  #router = inject(Router);
  #exploration = inject(ExplorationService);
  #userService = inject(UserService);
  
  readonly seoConfig = {
    title: 'Welcome to Oríta',
    description: 'Discover the world around you or build your business on Oríta.',
  };

  step: 'start' | 'location' | 'interests' = 'start';
  selectedInterests: string[] = [];
  isSaving = false;

  onExplore() {
    this.step = 'location';
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
    this.step = 'interests';
  }

  onInterestsChange(selectedIds: string[]) {
    this.selectedInterests = selectedIds;
  }

  async finishOnboarding() {
    if (this.isSaving) return;
    
    if (this.selectedInterests.length > 0) {
      this.isSaving = true;
      try {
        await this.#userService.updateInterests(this.selectedInterests);
      } catch {
        // Silently continue if saving fails during onboarding
      } finally {
        this.isSaving = false;
      }
    }
    this.#router.navigate(['/home']);
  }

  skipInterests() {
    this.#router.navigate(['/home']);
  }
}
