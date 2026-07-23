import { Component, computed, input, output, signal } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideChevronsLeft, LucideChevronsRight, LucideMoreHorizontal } from '@lucide/angular';

export type PaginationItem = {
  type: 'page' | 'ellipsis';
  pageNumber?: number;
};

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [LucideChevronLeft, LucideChevronRight, LucideChevronsLeft, LucideChevronsRight, LucideMoreHorizontal],
  styleUrl: './pagination.css',
  template: `
    <nav aria-label="pagination" class="app-pagination">
      @if (showBoundaryLinks()) {
        <button 
          class="pagination-btn pagination-btn--nav" 
          [disabled]="currentPage() <= 1"
          (click)="goTo(1)"
          aria-label="Go to first page">
          <svg lucideChevronsLeft></svg>
        </button>
      }

      <button 
        class="pagination-btn pagination-btn--nav" 
        [disabled]="currentPage() <= 1"
        (click)="goTo(currentPage() - 1)"
        aria-label="Go to previous page">
        <svg lucideChevronLeft></svg>
      </button>

      <ul class="pagination-list">
        @for (item of items(); track $index) {
          <li>
            @if (item.type === 'ellipsis') {
              <span class="pagination-ellipsis" aria-hidden="true">
                <svg lucideMoreHorizontal></svg>
              </span>
            } @else {
              <button 
                class="pagination-btn"
                [class.pagination-btn--active]="item.pageNumber === currentPage()"
                [attr.aria-current]="item.pageNumber === currentPage() ? 'page' : null"
                (click)="goTo(item.pageNumber!)"
                [attr.aria-label]="'Go to page ' + item.pageNumber">
                {{ item.pageNumber }}
              </button>
            }
          </li>
        }
      </ul>

      <button 
        class="pagination-btn pagination-btn--nav" 
        [disabled]="currentPage() >= totalPages()"
        (click)="goTo(currentPage() + 1)"
        aria-label="Go to next page">
        <svg lucideChevronRight></svg>
      </button>

      @if (showBoundaryLinks()) {
        <button 
          class="pagination-btn pagination-btn--nav" 
          [disabled]="currentPage() >= totalPages()"
          (click)="goTo(totalPages())"
          aria-label="Go to last page">
          <svg lucideChevronsRight></svg>
        </button>
      }
    </nav>
  `
})
export class Pagination {
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  siblingCount = input<number>(1);
  showBoundaryLinks = input<boolean>(false);

  pageChange = output<number>();

  isMobile = signal(window.matchMedia('(max-width: 600px)').matches);

  constructor() {
    window.matchMedia('(max-width: 600px)').addEventListener('change', e => {
      this.isMobile.set(e.matches);
    });
  }

  items = computed<PaginationItem[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    // On mobile, aggressively collapse siblings to 0 so we only show First/Last and Current.
    const siblings = this.isMobile() ? 0 : this.siblingCount();

    // The total number of items we want to show:
    // 1 (first) + 1 (last) + 1 (current) + 2*siblings + 2 (ellipses)
    // If total pages is small, we just show all of them.
    const totalPageNumbersToShow = 3 + (2 * siblings); 
    
    if (total <= totalPageNumbersToShow) {
      return Array.from({ length: total }).map((_, i) => ({ type: 'page', pageNumber: i + 1 }));
    }

    const leftSiblingIndex = Math.max(current - siblings, 1);
    const rightSiblingIndex = Math.min(current + siblings, total);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < total - 1;

    const result: PaginationItem[] = [];

    // First Page
    result.push({ type: 'page', pageNumber: 1 });

    // Left Ellipsis or missing items
    if (showLeftEllipsis) {
      result.push({ type: 'ellipsis' });
    } else if (leftSiblingIndex > 1) {
      // If we are missing exactly 1 item, just show it instead of an ellipsis
      result.push({ type: 'page', pageNumber: 2 });
    }

    // Middle items
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== total) {
        result.push({ type: 'page', pageNumber: i });
      }
    }

    // Right Ellipsis or missing items
    if (showRightEllipsis) {
      result.push({ type: 'ellipsis' });
    } else if (rightSiblingIndex < total) {
      result.push({ type: 'page', pageNumber: total - 1 });
    }

    // Last Page
    if (total > 1) {
      result.push({ type: 'page', pageNumber: total });
    }

    return result;
  });

  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
