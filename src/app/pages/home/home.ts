import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LucideSearch,
  LucideMapPin,
  LucideStore,
  LucidePackage,
} from '@lucide/angular';
import { Logo } from '../../shared/logo/logo';
import { AppBizCard } from '../../shared/biz-card/biz-card';
import { AppListingCard } from '../../shared/listing-card/listing-card';
import { IBusinessSummary, IListingSummary, IPaginated, ICategory } from './home.interface';
import { environment } from '../../../environments/environment';

type ExploreTab = 'businesses' | 'listings';

@Component({
  selector: 'app-home',
  imports: [
    Logo,
    AppBizCard,
    AppListingCard,
    LucideSearch,
    LucideMapPin,
    LucideStore,
    LucidePackage,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  #router = inject(Router);

  readonly activeTab = signal<ExploreTab>('businesses');
  readonly activeCategorySlug = signal<string | null>(null);
  readonly searchQuery = signal('');

  readonly categories = httpResource<ICategory[]>(() => `${environment.apiUrl}/categories`);

  readonly leafCategories = computed<ICategory[]>(() => {
    const cats = this.categories.value() ?? [];
    return cats.flatMap((root) => (root.children ?? []).filter((c) => c.isActive));
  });

  readonly businesses = httpResource<IPaginated<IBusinessSummary>>(() => {
    const params = new URLSearchParams();
    if (this.searchQuery().trim()) params.set('search', this.searchQuery().trim());
    const qs = params.toString();
    return `${environment.apiUrl}/businesses${qs ? `?${qs}` : ''}`;
  });

  readonly listings = httpResource<IPaginated<IListingSummary>>(() => {
    const params = new URLSearchParams();
    if (this.searchQuery().trim()) params.set('search', this.searchQuery().trim());
    if (this.activeCategorySlug()) params.set('categorySlug', this.activeCategorySlug()!);
    const qs = params.toString();
    return `${environment.apiUrl}/listings${qs ? `?${qs}` : ''}`;
  });

  readonly filteredBusinesses = computed(() => {
    const items = this.businesses.value()?.items ?? [];
    const catSlug = this.activeCategorySlug();
    if (!catSlug) return items;
    const cat = this.leafCategories().find((c) => c.slug === catSlug);
    if (!cat) return items;
    return items.filter((b) => b.categoryIds.includes(cat.id));
  });

  setTab(tab: ExploreTab): void {
    this.activeTab.set(tab);
  }

  selectCategory(slug: string): void {
    this.activeCategorySlug.update((current) => (current === slug ? null : slug));
  }

  goToProfile(): void {
    this.#router.navigate(['/profile']);
  }

}
