import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ExplorationService } from '../../core/services/exploration.service';

export const locationRequiredGuard: CanActivateFn = () => {
  const exploration = inject(ExplorationService);
  const router = inject(Router);

  if (exploration.hasLocation()) {
    return router.parseUrl('/home');
  }

  return true;
};
