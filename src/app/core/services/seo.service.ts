import { Service, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  jsonLd?: Record<string, any>;
}

@Service()
export class SeoService {
  #title = inject(Title);
  #meta = inject(Meta);
  #document = inject(DOCUMENT);

  private readonly defaultTitle = 'Orita';
  private readonly defaultDesc = 'Local discovery platform connecting people with businesses, services, and opportunities around them.';
  private readonly defaultImage = 'https://inquisitive-ernestine-odysseon-ae88add1.koyeb.app/logo.png';

  generateTags(config: SeoConfig) {
    const title = config.title ? `${config.title} | Orita` : this.defaultTitle;
    this.#title.setTitle(title);

    const description = config.description || this.defaultDesc;
    this.#meta.updateTag({ name: 'description', content: description });

    // Open Graph
    this.#meta.updateTag({ property: 'og:title', content: title });
    this.#meta.updateTag({ property: 'og:description', content: description });
    this.#meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.#meta.updateTag({ property: 'og:image', content: config.image || this.defaultImage });
    
    if (config.url) {
      this.#meta.updateTag({ property: 'og:url', content: config.url });
    }

    // Twitter Card
    this.#meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.#meta.updateTag({ name: 'twitter:title', content: title });
    this.#meta.updateTag({ name: 'twitter:description', content: description });
    this.#meta.updateTag({ name: 'twitter:image', content: config.image || this.defaultImage });

    // JSON-LD Structured Data
    if (config.jsonLd) {
      this.insertJsonLd(config.jsonLd);
    } else {
      this.removeJsonLd();
    }
  }

  private insertJsonLd(schema: Record<string, any>) {
    this.removeJsonLd();
    
    const script = this.#document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-json-ld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      ...schema
    });
    this.#document.head.appendChild(script);
  }

  private removeJsonLd() {
    const existing = this.#document.getElementById('seo-json-ld');
    if (existing) {
      existing.remove();
    }
  }
}
