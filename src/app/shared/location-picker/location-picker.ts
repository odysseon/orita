import { Component, input, model, output, signal, inject } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';
import { Drawer } from '../drawer/drawer';
import { LocationSelector } from '../location-selector/location-selector';
import { Location } from '../../core/services/location.service';
import { FollowService } from '../../core/services/follow.service';
import { FollowButton } from '../follow-button/follow-button';
import { firstValueFrom } from 'rxjs';
import { Button } from '../ui/atoms/button/button';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [Drawer, LocationSelector, LucideMapPin, FollowButton, Button],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css',
})
export class LocationPicker {
  readonly open = model<boolean>(false);
  readonly triggerLabel = input<string>('Set Location');
  readonly currentAddress = input<string>();

  readonly confirmed = output<Location>();

  readonly provisional = signal<Location | null>(null);
  readonly provisionalIsFollowed = signal<boolean>(false);
  
  #followService = inject(FollowService);

  async onProvisionalPick(loc: Location): Promise<void> {
    this.provisional.set(loc);
    if (!loc.id) {
      this.provisionalIsFollowed.set(false);
      return;
    }
    try {
      const status = await firstValueFrom(this.#followService.getStatus('location', loc.id));
      this.provisionalIsFollowed.set(status.following);
    } catch {
      this.provisionalIsFollowed.set(false);
    }
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
    this.provisionalIsFollowed.set(false);
    this.open.set(false);
  }

  onDismissed(): void {
    this.provisional.set(null);
    this.provisionalIsFollowed.set(false);
  }
}
