import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { SeoConfig, SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-seo',
  template: '',
  standalone: true
})
export class SeoComponent implements OnChanges {
  #seo = inject(SeoService);

  readonly config = input.required<SeoConfig>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.#seo.generateTags(this.config());
    }
  }
}
