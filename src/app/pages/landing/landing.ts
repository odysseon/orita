import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideStore, LucideMessageCircle, LucideTrendingUp, LucideArrowRight } from '@lucide/angular';

@Component({
  selector: 'app-landing',
  imports: [LucideStore, LucideMessageCircle, LucideTrendingUp, LucideArrowRight],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  #router = inject(Router);

  getStarted() {
    this.#router.navigate(['/auth/register']);
  }

  explore() {
    this.#router.navigate(['/home']);
  }
}
