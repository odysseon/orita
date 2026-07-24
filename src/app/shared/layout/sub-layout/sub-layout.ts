import { Component, inject, signal, effect, EffectRef, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { isLayoutPage } from './layout-page.interface';
import { PageHeader } from '../../ui/organisms/page-header/page-header';

@Component({
  selector: 'app-sub-layout',
  imports: [PageHeader, RouterOutlet],
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
}
