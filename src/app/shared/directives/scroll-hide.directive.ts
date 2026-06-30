import { Directive, ElementRef, inject, NgZone, OnInit, OnDestroy, PLATFORM_ID, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[uiScrollHide]',
})
export class ScrollHideDirective implements OnInit, OnDestroy {
  #el = inject(ElementRef<HTMLElement>);
  #zone = inject(NgZone);
  #platformId = inject(PLATFORM_ID);
  
  // Optionally disable the directive (e.g., when not in bottom mode)
  uiScrollHide = input<boolean>(true);

  private lastScrollY = 0;
  private isHidden = false;
  // Minimum scroll delta before triggering a hide/show (prevents jitter)
  private readonly threshold = 10; 
  private scrollListener!: () => void;

  ngOnInit() {
    if (!isPlatformBrowser(this.#platformId)) return;
    
    // Apply base CSS transitions for silky smooth physics
    // We use standard easing (decelerate/accelerate) matching material guidelines
    this.#el.nativeElement.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)';
    
    this.scrollListener = () => {
      // If the directive is disabled dynamically, ensure it's visible
      if (!this.uiScrollHide()) {
        if (this.isHidden) {
           this.#el.nativeElement.style.transform = 'translateY(0)';
           this.isHidden = false;
        }
        return;
      }
      
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - this.lastScrollY;
      
      // Don't do anything if we haven't scrolled past the threshold
      if (Math.abs(delta) < this.threshold) return;
      
      // Ensure visibility if we bounce at the very top of the page (Safari/iOS)
      if (currentScrollY <= 0) {
        if (this.isHidden) {
          this.#el.nativeElement.style.transform = 'translateY(0)';
          this.isHidden = false;
        }
        this.lastScrollY = currentScrollY;
        return;
      }
      
      // Ensure visibility if we hit the absolute bottom (so users can interact at the end of content)
      if (currentScrollY + window.innerHeight >= document.body.scrollHeight) {
         if (this.isHidden) {
            this.#el.nativeElement.style.transform = 'translateY(0)';
            this.isHidden = false;
         }
         this.lastScrollY = currentScrollY;
         return;
      }

      if (delta > 0 && !this.isHidden) {
        // Scrolling down -> hide the element by pushing it down by 100% of its height
        this.#el.nativeElement.style.transform = 'translateY(100%)';
        this.isHidden = true;
      } else if (delta < 0 && this.isHidden) {
        // Scrolling up -> show the element
        this.#el.nativeElement.style.transform = 'translateY(0)';
        this.isHidden = false;
      }
      
      this.lastScrollY = currentScrollY;
    };

    // Run the scroll listener completely outside Angular's change detection zone
    // This is critical for 60fps scrolling performance!
    this.#zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.#platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
