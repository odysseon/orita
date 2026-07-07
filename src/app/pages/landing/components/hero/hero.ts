import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../../../../shared/logo/logo';
import { DiscoveryPreview } from './discovery-preview';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, Logo, DiscoveryPreview],
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
