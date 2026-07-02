import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideStore,
  LucideMessageCircle,
  LucideTrendingUp,
  LucideArrowRight,
  LucideSearch,
  LucideMapPin,
} from '@lucide/angular';

@Component({
  selector: 'app-landing',
  imports: [
    RouterLink,
    LucideStore,
    LucideMessageCircle,
    LucideTrendingUp,
    LucideArrowRight,
    LucideSearch,
    LucideMapPin,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  #router = inject(Router);

  getStarted() {
    this.#router.navigate(['/auth/register']);
  }

  login() {
    this.#router.navigate(['/auth/login']);
  }

  explore() {
    this.#router.navigate(['/home']);
  }
}
