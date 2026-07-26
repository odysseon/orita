import { Component, ContentChild, ElementRef, output, signal, AfterContentInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LucideSearch, LucideX } from '@lucide/angular';
import { InputDirective } from '../../atoms/forms';

@Component({
  selector: 'ui-search-bar',
  imports: [LucideSearch, LucideX],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  encapsulation: ViewEncapsulation.None,
})
export class SearchBar implements AfterContentInit, OnDestroy {
  @ContentChild(InputDirective, { read: ElementRef }) inputElement?: ElementRef<HTMLInputElement>;
  
  readonly clear = output<void>();
  readonly hasValue = signal(false);

  #inputListener?: EventListener;

  ngAfterContentInit() {
    if (this.inputElement?.nativeElement) {
      const el = this.inputElement.nativeElement;
      
      // Initial check
      this.hasValue.set(!!el.value);

      // Listen for native input events
      this.#inputListener = () => {
        this.hasValue.set(!!el.value);
      };
      
      el.addEventListener('input', this.#inputListener);
    }
  }

  ngOnDestroy() {
    if (this.inputElement?.nativeElement && this.#inputListener) {
      this.inputElement.nativeElement.removeEventListener('input', this.#inputListener);
    }
  }

  onClear() {
    if (this.inputElement?.nativeElement) {
      this.inputElement.nativeElement.value = '';
      // Dispatch input event so Angular forms/ngModel pick up the change
      this.inputElement.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      this.hasValue.set(false);
      this.inputElement.nativeElement.focus();
    }
    this.clear.emit();
  }
}
