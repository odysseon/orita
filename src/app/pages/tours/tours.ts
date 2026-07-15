import { Component, inject, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppHeader } from '../../shared/app-header/app-header';
import { TourCard } from './components/tour-card/tour-card';
import { BusinessTourService, IBusinessTour } from '../../core/services/business-tour.service';

@Component({
  selector: 'app-tours-page',
  imports: [AppHeader, TourCard],
  template: `
    <!-- Top Nav: absolutely positioned over the feed -->
    <div class="tours-nav">
      <ui-app-header pageTitle="Tours" [showLogo]="false"></ui-app-header>
    </div>

    <div class="tours-feed" (wheel)="onWheel($event)">
      @if (loading() && tours().length === 0) {
        <div class="tours-loading">Loading amazing places...</div>
      } @else if (tours().length === 0) {
        <div class="tours-empty">
          <h2>No tours found</h2>
          <p>Check back soon for new local experiences.</p>
        </div>
      } @else {
        <!-- Virtualized rendering (Current, Previous, Next) -->
        <div class="tours-track" [style.transform]="'translateY(' + (-currentIndex() * 100) + 'dvh)'">
          @for (tour of tours(); track tour.id; let i = $index) {
            <!-- Only render if it's the current, previous, or next item -->
            @if (i >= currentIndex() - 1 && i <= currentIndex() + 1) {
              <div class="tour-slide">
                <app-tour-card
                  [tour]="tour"
                  [businessData]="mockBusinessData(tour)"
                  (actionClick)="onActionClick($event, tour)"
                />
              </div>
            } @else {
              <!-- Empty placeholder to maintain track height -->
              <div class="tour-slide"></div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tours-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      /* Pass through clicks if user taps between header items */
      pointer-events: none;
    }
    .tours-nav ui-app-header {
      pointer-events: auto;
    }

    .tours-feed {
      height: 100vh;
      height: 100dvh;
      width: 100%;
      background-color: #000;
      overflow: hidden; /* We handle scrolling via translate */
      position: relative;
    }

    .tours-track {
      transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      width: 100%;
      height: 100%;
    }

    .tour-slide {
      width: 100%;
      height: 100dvh;
      overflow: hidden;
    }

    .tours-loading, .tours-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-on-dark);
      text-align: center;
      padding: var(--size-24);
    }
    .tours-empty h2 { margin: 0 0 var(--size-8) 0; font-size: var(--size-24); }
    .tours-empty p { margin: 0; opacity: 0.7; }
  `],
})
export class ToursPage implements OnInit, OnDestroy {
  #title = inject(Title);
  #router = inject(Router);
  #tourService = inject(BusinessTourService);

  readonly tours = signal<IBusinessTour[]>([]);
  readonly loading = signal(true);
  readonly currentIndex = signal(0);
  
  #page = 1;
  #hasMore = true;
  #isScrolling = false;

  // For touch support
  #touchStartY = 0;
  #touchEndY = 0;

  ngOnInit(): void {
    this.#title.setTitle('Discover Tours | Oríta');
    this.loadMoreTours();
  }

  loadMoreTours(): void {
    if (!this.#hasMore) return;
    this.loading.set(true);

    this.#tourService.discoverGlobal({ page: this.#page, limit: 10, status: 'PUBLISHED' as any }).subscribe({
      next: (res) => {
        this.tours.update(prev => [...prev, ...res.items]);
        this.#hasMore = (res.page * res.limit) < res.total;
        this.#page++;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tours', err);
        this.loading.set(false);
      }
    });
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    // Only handle scroll if over the feed area, but since it's full screen, it's fine.
    if (this.#isScrolling || this.tours().length === 0) return;

    if (event.deltaY > 50) {
      this.nextSlide();
    } else if (event.deltaY < -50) {
      this.prevSlide();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.#touchStartY = event.changedTouches[0].screenY;
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (this.#isScrolling || this.tours().length === 0) return;
    
    this.#touchEndY = event.changedTouches[0].screenY;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const threshold = 50; // min distance
    const diff = this.#touchStartY - this.#touchEndY;
    
    if (diff > threshold) {
      this.nextSlide();
    } else if (diff < -threshold) {
      this.prevSlide();
    }
  }

  private nextSlide(): void {
    if (this.currentIndex() < this.tours().length - 1) {
      this.setIndex(this.currentIndex() + 1);
      
      // Load more if getting close to the end
      if (this.currentIndex() >= this.tours().length - 3) {
        this.loadMoreTours();
      }
    }
  }

  private prevSlide(): void {
    if (this.currentIndex() > 0) {
      this.setIndex(this.currentIndex() - 1);
    }
  }

  private setIndex(index: number): void {
    this.currentIndex.set(index);
    this.#isScrolling = true;
    setTimeout(() => {
      this.#isScrolling = false;
    }, 400); // match css transition duration
  }

  // Mocking the local context since the API doesn't return business location/rating directly in the Tour schema yet
  mockBusinessData(tour: IBusinessTour): any {
    return {
      name: 'The Place Restaurant', // Ideally we fetch this from business profile
      rating: 4.8,
      locationText: 'Bodija, Ibadan',
      distanceStr: '120 m',
      isOpen: true
    };
  }

  onActionClick(action: string, tour: IBusinessTour): void {
    switch (action) {
      case 'directions':
        console.log('Get directions to', tour.businessProfileId);
        break;
      case 'business':
        this.#router.navigate(['/b', tour.businessProfileId]);
        break;
      case 'message':
        this.#router.navigate(['/messages'], { queryParams: { tour: tour.id, business: tour.businessProfileId } });
        break;
      case 'save':
        console.log('Save tour', tour.id);
        break;
    }
  }

  ngOnDestroy(): void {}
}
