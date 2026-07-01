import { Component, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ToastContainer } from './core/components/toast-container/toast-container';
import { NavList } from './shared/nav-list/nav-list';
import { NavItem } from './shared/nav-item/nav-item';
import { ScrollHideDirective } from './shared/directives/scroll-hide.directive';
import { LucideHome, LucideUser, LucideLogIn } from '@lucide/angular';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer, NavList, NavItem, ScrollHideDirective, LucideHome, LucideUser, LucideLogIn],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('orita');
  
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #platformId = inject(PLATFORM_ID);
  #auth = inject(AuthService);

  readonly isAuthenticated = computed(() => !!this.#auth.token());

  readonly showNav = toSignal(
    this.#router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.getDeepestIsRoot(this.#route.snapshot)),
    ),
    { initialValue: this.getDeepestIsRoot(this.#route.snapshot) }
  );

  readonly isDesktop = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      this.isDesktop.set(mediaQuery.matches);
      
      mediaQuery.addEventListener('change', (e) => {
        this.isDesktop.set(e.matches);
      });
    }
  }

  private getDeepestIsRoot(route: any): boolean {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.data?.['isRootAppPage'] === true;
  }

  isActive(path: string): boolean {
    return this.#router.url.startsWith(path);
  }

  go(path: string): void {
    this.#router.navigate([path]);
  }
}
