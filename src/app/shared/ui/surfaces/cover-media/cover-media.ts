import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-cover-media',
  standalone: true,
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" class="ui-cover-media__img" (error)="handleError()" [class.is-error]="hasError" />
    }
    @if (!src() || hasError) {
      <div class="ui-cover-media__placeholder">
        <ng-content select="[cover-placeholder]"></ng-content>
      </div>
    }
    @if (overlayGradient()) {
      <div class="ui-cover-media__gradient"></div>
    }
    <div class="ui-cover-media__overlay">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './cover-media.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-cover-media]': 'true',
    '[style.aspect-ratio]': 'aspectRatio()'
  }
})
export class CoverMedia {
  src = input<string | null | undefined>(null);
  alt = input<string>('');
  aspectRatio = input<string>('auto');
  overlayGradient = input<boolean>(false);

  hasError = false;

  handleError() {
    this.hasError = true;
  }
}
