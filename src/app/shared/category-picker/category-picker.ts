import { Component, input, model, computed, signal, inject, ViewEncapsulation } from '@angular/core';
import { InputDirective } from '../ui/atoms/forms';
import { LucideSearch, LucideChevronDown, LucideLoaderCircle } from '@lucide/angular';
import { CategoryService } from '../../core/services/category.service';
import { Drawer } from '../drawer/drawer';

@Component({
  selector: 'app-category-picker',
  imports: [LucideSearch, LucideChevronDown, LucideLoaderCircle, Drawer, InputDirective],
  templateUrl: './category-picker.html',
  styleUrl: './category-picker.css',
  encapsulation: ViewEncapsulation.None
})
export class CategoryPicker {
  #categoryService = inject(CategoryService);

  readonly categoryId = model<string>('');
  readonly placeholder = input<string>('Select a category');
  readonly id = input<string>('');
  
  readonly isOpen = signal(false);
  readonly searchQuery = signal('');

  readonly categories = this.#categoryService.leafCategories;
  readonly isLoading = computed(() => this.#categoryService.categories.isLoading());

  readonly filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.categories();
    return this.categories().filter(c => c.name.toLowerCase().includes(query));
  });

  readonly selectedCategoryName = computed(() => {
    const id = this.categoryId();
    if (!id) return '';
    return this.categories().find(c => c.id === id)?.name || '';
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  openPicker() {
    this.searchQuery.set('');
    this.isOpen.set(true);
  }

  selectCategory(id: string) {
    this.categoryId.set(id);
    this.isOpen.set(false);
  }
}
