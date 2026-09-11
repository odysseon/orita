import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DiscoveryPreview } from './discovery-preview';
import { Button } from 'ur-ui';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DiscoveryPreview, Button],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  #router = inject(Router);

  startExploring() {
    this.#router.navigate(['/home']);
  }

  listBusiness() {
    this.#router.navigate(['/auth/register']);
  }

  login() {
    this.#router.navigate(['/auth/login']);
  }
}
