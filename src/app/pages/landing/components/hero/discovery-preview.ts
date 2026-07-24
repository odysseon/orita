import { Component } from '@angular/core';

import { LucideSearch, LucideMapPin } from '@lucide/angular';
import { Button } from '../../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-discovery-preview',
  standalone: true,
  imports: [LucideSearch, LucideMapPin, Button],
  templateUrl: './discovery-preview.html',
  styleUrl: './discovery-preview.css',
})
export class DiscoveryPreview {
  readonly nearbyProducts = ['Shawarma', 'Sneakers', 'Phone Repair', 'Furniture'];
}
