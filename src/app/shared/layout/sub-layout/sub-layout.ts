import { Component, inject, signal, effect, EffectRef, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { AppHeader } from '../../app-header/app-header';
import { ScrollHideDirective } from '../../directives/scroll-hide.directive';
import { LucideArrowLeft } from '@lucide/angular';
import { isLayoutPage } from './layout-page.interface';

@Component({
  selector: 'app-sub-layout',
  imports: [AppHeader, ScrollHideDirective, LucideArrowLeft, RouterOutlet],
  templateUrl: './sub-layout.html',
  styleUrl: './sub-layout.css',
})
export class AppSubLayout {
  #location = inject(Location);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #injector = inject(Injector);

  readonly title = signal<string>('');
  #titleEffectRef?: EffectRef;

  onActivate(componentRef: any): void {
    if (this.#titleEffectRef) {
      this.#titleEffectRef.destroy();
      this.#titleEffectRef = undefined;
    }

    // 1. Check static route data from the deepest active route
    let current = this.#route.snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    const routeTitle = current.data['title'];
    if (routeTitle) {
      this.title.set(routeTitle);
      return;
    }

    // 2. Component implements LayoutPage
    if (isLayoutPage(componentRef)) {
      this.#titleEffectRef = effect(() => {
        const pageTitle = componentRef.pageTitle();
        this.title.set(pageTitle ?? '');
      }, { injector: this.#injector });
      return;
    }

    // 3. Fallback
    this.title.set('');
  }

  handleBack(): void {
    const navId = history.state?.navigationId ?? 1;
    if (navId > 1) {
      this.#location.back();
    } else {
      this.#router.navigateByUrl('/home');
    }
  }
}
