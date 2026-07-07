import { Service, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICategory } from '../../pages/home/home.interface';

export interface ICategoryAttribute {
  id: string;
  key: string;
  label: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  isRequired: boolean;
  options: string[] | null;
}

@Service()
export class CategoryService {
  #http = inject(HttpClient);
  
  readonly categories = httpResource<ICategory[]>(() => `${environment.apiUrl}/categories`);

  readonly leafCategories = computed<ICategory[]>(() => {
    const cats = this.categories.value() ?? [];
    return cats.flatMap((root) => (root.children ?? []).filter((c) => c.isActive));
  });

  async getCategoryAttributes(categoryId: string): Promise<ICategoryAttribute[]> {
    const cats = this.categories.value() ?? [];
    let slug = '';
    
    for (const root of cats) {
      if (root.id === categoryId) slug = root.slug;
      for (const child of root.children || []) {
        if (child.id === categoryId) slug = child.slug;
      }
    }

    if (!slug) return [];

    try {
      return await firstValueFrom(
        this.#http.get<ICategoryAttribute[]>(`${environment.apiUrl}/categories/${slug}/attributes`)
      );
    } catch {
      return [];
    }
  }
}
