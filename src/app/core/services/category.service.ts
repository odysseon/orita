import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ICategory } from '../../pages/home/home.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  readonly categories = httpResource<ICategory[]>(() => `${environment.apiUrl}/categories`);

  readonly leafCategories = computed<ICategory[]>(() => {
    const cats = this.categories.value() ?? [];
    return cats.flatMap((root) => (root.children ?? []).filter((c) => c.isActive));
  });
}
