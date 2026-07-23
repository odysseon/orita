import { Component, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ToastContainer } from './core/components/toast-container/toast-container';
import { NavList } from './shared/nav-list/nav-list';
import { NavItem } from './shared/nav-item/nav-item';
import { ScrollHideDirective } from './shared/directives/scroll-hide.directive';
import { Badge } from './shared/ui/atoms/badge/badge';
import { LucideHouse, LucideSearch, LucideCompass, LucideMessageCircle, LucideMapPin } from '@lucide/angular';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { MessagingRepository } from './core/services/messaging-repository.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastContainer,
    NavList,
    NavItem,
    ScrollHideDirective,
    LucideHouse,
    LucideSearch,
    LucideCompass,
    LucideMessageCircle,
    LucideMapPin,
    Badge,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('orita');

  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #platformId = inject(PLATFORM_ID);
  readonly authService = inject(AuthService);
  readonly notificationService = inject(NotificationService);
  readonly messaging = inject(MessagingRepository);

  readonly isAuthenticated = computed(() => !!this.authService.token());

  readonly isRootAppPage = toSignal(
    this.#router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.getDeepestIsRoot(this.#router.routerState.snapshot.root)),
    ),
    { initialValue: this.getDeepestIsRoot(this.#router.routerState.snapshot.root) },
  );

  readonly showNav = computed(() => {
    const isRoot = this.isRootAppPage();
    if (!this.isDesktop() && this.messaging.activeConversation()) {
      return false;
    }
    return isRoot;
  });

  readonly isLanding = toSignal(
    this.#router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.getDeepestIsLanding(this.#router.routerState.snapshot.root)),
    ),
    { initialValue: this.getDeepestIsLanding(this.#router.routerState.snapshot.root) },
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

  private getDeepestIsLanding(route: any): boolean {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.data?.['isLandingPage'] === true;
  }

  isActive(path: string): boolean {
    return this.#router.url.startsWith(path);
  }

  go(path: string): void {
    this.#router.navigate([path]);
  }
}
