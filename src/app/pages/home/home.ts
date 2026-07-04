import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import {
  LucideSearch,
  LucideMapPin,
  LucideStore,
  LucidePackage,
  LucideImage,
} from '@lucide/angular';
import { AppBizCard } from '../../shared/biz-card/biz-card';
import { AppListingCard } from '../../shared/listing-card/listing-card';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { HomeHeader } from '../../shared/home-header/home-header';
import { ScrollHideDirective } from '../../shared/directives/scroll-hide.directive';
import { CreateBusiness } from '../profile/business/create/create-business';
import { IBusinessSummary, IListingSummary, IPaginated, ICategory } from './home.interface';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../core/services/category.service';
import { BusinessTourService, IBusinessTour } from '../../core/services/business-tour.service';

type ExploreTab = 'businesses' | 'listings' | 'tours';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AppBizCard,
    AppListingCard,
    LucideSearch,
    LucideStore,
    LucidePackage,
    LucideImage,
    EmptyState,
    CreateBusiness,
    HomeHeader,
    ScrollHideDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  #router = inject(Router);
  #categoryService = inject(CategoryService);
  #tourService = inject(BusinessTourService);

  readonly activeTab = signal<ExploreTab>('businesses');
  readonly activeCategorySlug = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly isCreateBusinessOpen = signal(false);

  readonly categories = this.#categoryService.categories;
  readonly leafCategories = this.#categoryService.leafCategories;

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

  readonly tours = httpResource<IPaginated<IBusinessTour>>(() => {
    const params = new URLSearchParams();
    params.set('status', 'PUBLISHED');
    if (this.searchQuery().trim()) params.set('search', this.searchQuery().trim());
    const qs = params.toString();
    return `${environment.apiUrl}/business-tours${qs ? `?${qs}` : ''}`;
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

  onBusinessCreated(): void {
    this.businesses.reload();
    this.#router.navigate(['/profile/business']);
  }

}
