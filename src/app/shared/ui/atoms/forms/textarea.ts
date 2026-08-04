import { Directive, ElementRef, HostListener, DoCheck, inject } from '@angular/core';

@Directive({
  selector: 'textarea[app-textarea]',
  standalone: true,
  host: {
    '[class.app-textarea]': 'true',
    '[style.resize]': '"none"',
    '[style.overflow]': '"hidden"',
    '[style.min-height]': '`calc(var(--size-1) * ${40})`'
  }
})
export class TextareaDirective implements DoCheck {
  private el = inject(ElementRef<HTMLTextAreaElement>);
  private lastValue = '';

  @HostListener('input')
  onInput() {
    this.adjustHeight();
  }

  ngDoCheck() {
    const currentValue = this.el.nativeElement.value;
    if (currentValue !== this.lastValue) {
      this.lastValue = currentValue;
      this.adjustHeight();
    }
  }

  private adjustHeight() {
    const textarea = this.el.nativeElement;
    // Reset height to auto to get the correct scrollHeight if it shrank
    textarea.style.height = 'auto';
    textarea.style.height = `calc(var(--size-1) * ${textarea.scrollHeight})`;
  }
}
