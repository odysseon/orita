import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppHeader } from '../../../shared/app-header/app-header';
import { ScrollHideDirective } from '../../../shared/directives/scroll-hide.directive';
import { LucideArrowLeft } from '@lucide/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-profile-sub-layout',
  imports: [RouterOutlet, AppHeader, ScrollHideDirective, LucideArrowLeft],
  templateUrl: './profile-sub-layout.html',
  styleUrl: './profile-sub-layout.css',
})
export class ProfileSubLayout {
  #route = inject(ActivatedRoute);
  #location = inject(Location);
  #router = inject(Router);

  readonly title = toSignal(
    inject(Router).events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.getDeepestTitle(this.#route.snapshot)),
    ),
    { initialValue: this.getDeepestTitle(this.#route.snapshot) },
  );

  private getDeepestTitle(route: any): string | undefined {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.data?.['title'];
  }

  handleBack(): void {
    const navId = history.state?.navigationId ?? 1;
    if (navId > 1) {
      this.#location.back();
    } else {
      this.#router.navigateByUrl('/profile');
    }
  }
}
