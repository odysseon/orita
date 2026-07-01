import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideFileQuestion } from '@lucide/angular';

@Component({
  selector: 'app-not-found',
  imports: [LucideFileQuestion],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  #router = inject(Router);

  goHome(): void {
    this.#router.navigate(['/']);
  }
}
