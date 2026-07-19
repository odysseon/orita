import { Component } from '@angular/core';

import { LucideSearch, LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-discovery-preview',
  standalone: true,
  imports: [LucideSearch, LucideMapPin],
  templateUrl: './discovery-preview.html',
  styleUrl: './discovery-preview.css',
})
export class DiscoveryPreview {
  readonly nearbyProducts = ['Shawarma', 'Sneakers', 'Phone Repair', 'Furniture'];
}
