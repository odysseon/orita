import { Component, OnChanges, SimpleChanges, inject, input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SeoConfig, SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-seo',
  template: '',
  standalone: true
})
export class SeoComponent implements OnChanges {
  #seo = inject(SeoService);
  #document = inject(DOCUMENT);

  readonly config = input.required<SeoConfig>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      const config = this.config();
      this.#seo.generateTags(config);
      this.updateCanonicalUrl(config.url);
    }
  }

  private updateCanonicalUrl(url?: string): void {
    if (!url) return;
    let link: HTMLLinkElement | null = this.#document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.#document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.#document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
