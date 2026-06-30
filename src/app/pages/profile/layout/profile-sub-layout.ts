import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AppPageHeader } from '../../../shared/page-header/page-header';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-profile-sub-layout',
  imports: [RouterOutlet, AppPageHeader],
  templateUrl: './profile-sub-layout.html',
  styleUrl: './profile-sub-layout.css',
})
export class ProfileSubLayout {
  #route = inject(ActivatedRoute);

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
}
