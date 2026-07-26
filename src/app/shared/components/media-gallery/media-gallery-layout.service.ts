import { Service } from '@angular/core';

export interface GalleryLayout {
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD' | 'MULTIPLE';
  visibleItems: number;
  hasMore: boolean;
  moreCount: number;
}

@Service()
export class MediaGalleryLayoutService {
  calculateLayout(itemCount: number): GalleryLayout {
    if (itemCount === 1) {
      return { type: 'SINGLE', visibleItems: 1, hasMore: false, moreCount: 0 };
    } else if (itemCount === 2) {
      return { type: 'DOUBLE', visibleItems: 2, hasMore: false, moreCount: 0 };
    } else if (itemCount === 3) {
      return { type: 'TRIPLE', visibleItems: 3, hasMore: false, moreCount: 0 };
    } else if (itemCount === 4) {
      return { type: 'QUAD', visibleItems: 4, hasMore: false, moreCount: 0 };
    } else {
      return { type: 'MULTIPLE', visibleItems: 4, hasMore: true, moreCount: itemCount - 4 };
    }
  }
}
