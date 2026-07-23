import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'select[app-select]',
  standalone: true,
  host: {
    '[class.app-select]': 'true',
  }
})
export class SelectDirective implements OnInit {
  private el = inject(ElementRef<HTMLSelectElement>);
  private renderer = inject(Renderer2);

  ngOnInit() {
    // Because the custom chevron mask needs to be absolutely positioned over the native select,
    // and pseudo-elements on <select> are not reliably supported across all browsers,
    // we wrap the native select in a container and append the chevron to the container.
    const selectEl = this.el.nativeElement;
    const parent = selectEl.parentNode;
    
    // Only wrap if it's not already wrapped (to prevent double-wrapping in edge cases)
    if (parent && !(parent as HTMLElement).classList.contains('app-select-wrapper')) {
      const wrapper = this.renderer.createElement('div');
      this.renderer.addClass(wrapper, 'app-select-wrapper');
      
      const chevron = this.renderer.createElement('div');
      this.renderer.addClass(chevron, 'app-select-chevron');
      
      this.renderer.insertBefore(parent, wrapper, selectEl);
      this.renderer.appendChild(wrapper, selectEl);
      this.renderer.appendChild(wrapper, chevron);
    }
  }
}
