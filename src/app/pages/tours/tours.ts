import { Component, inject, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppHeader } from '../../shared/app-header/app-header';
import { TourCard } from './components/tour-card/tour-card';
import { BusinessTourService, IBusinessTour } from '../../core/services/business-tour.service';

@Component({
  selector: 'app-tours-page',
  imports: [AppHeader, TourCard],
  templateUrl: './tours.html',
  styleUrl: './tours.css',
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

    this.#tourService
      .discoverGlobal({ page: this.#page, limit: 10, status: 'PUBLISHED' as any })
      .subscribe({
        next: (res) => {
          this.tours.update((prev) => [...prev, ...res.items]);
          this.#hasMore = res.page * res.limit < res.total;
          this.#page++;
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading tours', err);
          this.loading.set(false);
        },
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
      isOpen: true,
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
        this.#router.navigate(['/messages'], {
          queryParams: { tour: tour.id, business: tour.businessProfileId },
        });
        break;
      case 'save':
        console.log('Save tour', tour.id);
        break;
    }
  }

  ngOnDestroy(): void {}
}
