import { Component } from '@angular/core';

@Component({
  selector: 'app-discovery-preview',
  standalone: true,
  templateUrl: './discovery-preview.html',
  styleUrl: './discovery-preview.css',
})
export class DiscoveryPreview {
  readonly nearbyProducts = ['Shawarma', 'Sneakers', 'Phone Repair', 'Furniture'];
}
