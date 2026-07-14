import { Component, computed, inject, signal } from '@angular/core';
import { httpResource, HttpClient } from '@angular/common/http';
import { resource } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {

  LucidePackage,
  LucideBookmark,
  LucideStore,
  LucideMessageCircle,
  LucidePhone,
  LucideStar,
  LucideMapPin,
} from '@lucide/angular';
import { environment } from '../../../environments/environment';
import { ShareButton } from '../../shared/share-button/share-button';
import { SaveButton } from '../../shared/save-button/save-button';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { SeoComponent } from '../../shared/seo/seo.component';
import { IBusinessLite, IListingDetail } from './listing.detail.interface';
import { LayoutPage } from '../../shared/layout/sub-layout/layout-page.interface';
import { CategoryService } from '../../core/services/category.service';
import { ListingAttributeFormatter, DisplayAttribute } from '../../shared/utils/listing-attribute-formatter';
import { ListingReviews } from './components/listing-reviews/listing-reviews';
import { ListingAttributes } from './components/listing-attributes/listing-attributes';
import { ListingBusinessCard } from './components/listing-business-card/listing-business-card';

@Component({
  selector: 'app-listing-detail',
  imports: [
    RouterLink,
    ShareButton,
    SaveButton,
    EmptyState,
    SeoComponent,
    LucidePackage,
    LucideStore,
    LucideMessageCircle,
    LucidePhone,
    LucideStar,
    LucideMapPin,
    ListingReviews,
    ListingAttributes,
    ListingBusinessCard,
  ],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.css',
})
export class ListingDetail implements LayoutPage {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #http = inject(HttpClient);
  #categoryService = inject(CategoryService);

  readonly Math = Math;

  readonly slug = computed(() => this.#route.snapshot.paramMap.get('slug') ?? '');

  readonly listing = httpResource<IListingDetail>(
    () => `${environment.apiUrl}/listings/${this.slug()}`,
  );

  readonly pageTitle = computed(() => this.listing.value()?.title);

  readonly business = httpResource<IBusinessLite>(() => {
    const businessId = this.listing.value()?.businessProfileId;
    if (!businessId) return undefined;
    return `${environment.apiUrl}/businesses/${businessId}`;
  });

  readonly avgRating = computed(() => {
    const reviews = this.listing.value()?.reviews ?? [];
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  });

  readonly priceLabel = computed(() => {
    const item = this.listing.value();
    if (!item) return '';
    if (!item.minPrice) return item.isNegotiable ? 'Negotiable' : 'Price on request';
    const currency = item.currencyCode ?? 'NGN';
    const min = Number(item.minPrice).toLocaleString();
    const max = item.maxPrice ? Number(item.maxPrice).toLocaleString() : null;
    return max ? `${currency} ${min} – ${max}` : `${currency} ${min}`;
  });

  readonly attributesResource = resource<DisplayAttribute[], { categoryId: string | null; attributes: Record<string, unknown> | null }>({
    params: () => ({
      categoryId: this.listing.value()?.categoryId ?? null,
      attributes: this.listing.value()?.attributes ?? null,
    }),
    loader: async ({ params }) => {
      if (!params.categoryId || !params.attributes) return [];
      const schema = await this.#categoryService.getCategoryAttributes(params.categoryId);
      return ListingAttributeFormatter.format(schema, params.attributes);
    },
  });

  readonly seoConfig = computed(() => {
    const item = this.listing.value();
    if (!item) return { title: 'Listing' };

    const biz = this.business.value();
    const minPrice = item.minPrice ? Number(item.minPrice) : 0;
    
    return {
      title: item.title,
      description: item.description || `Check out ${item.title} on Orita.`,
      image: biz?.avatarUrl || undefined,
      url: `https://orita.onrender.com/l/${item.slug}`,
      type: 'product' as const,
      jsonLd: {
        "@type": "Product",
        "name": item.title,
        "image": biz?.avatarUrl,
        "description": item.description,
        "offers": {
          "@type": "Offer",
          "priceCurrency": item.currencyCode || "NGN",
          "price": minPrice,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": biz ? {
            "@type": "Organization",
            "name": biz.name
          } : undefined
        }
      }
    };
  });

  starArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  }



  callPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openWhatsapp(number: string): void {
    window.open(`https://wa.me/${number.replace(/\D/g, '')}`, '_blank');
  }
}
