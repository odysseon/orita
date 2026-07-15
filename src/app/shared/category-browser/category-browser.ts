import { Component, input, output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideChevronRight, LucideChevronDown, LucideCheck } from '@lucide/angular';
import { CategoryService } from '../../core/services/category.service';
import { ICategory } from '../../pages/home/home.interface';

export type CategoryBrowserMode = 'single-leaf' | 'multi-leaf' | 'interest' | 'filter';

@Component({
  selector: 'app-category-browser',
  imports: [CommonModule, LucideChevronRight, LucideChevronDown, LucideCheck],
  templateUrl: './category-browser.html',
  styleUrl: './category-browser.css',
})
export class CategoryBrowser {
  #categoryService = inject(CategoryService);

  mode = input<CategoryBrowserMode>('interest');
  selectedIds = input<string[]>([]);
  selectionChange = output<string[]>();

  readonly categories = this.#categoryService.categories;
  
  // State for navigation
  readonly activeParentId = signal<string | null>(null);

  readonly config = computed(() => {
    switch (this.mode()) {
      case 'single-leaf':
        return { selectableRoots: false, selectableLeaves: true, multiple: false };
      case 'multi-leaf':
        return { selectableRoots: false, selectableLeaves: true, multiple: true };
      case 'interest':
      case 'filter':
        return { selectableRoots: true, selectableLeaves: true, multiple: true };
    }
  });

  readonly activeParent = computed(() => {
    const parentId = this.activeParentId();
    if (!parentId) return null;
    return this.categories.value()?.find(c => c.id === parentId) ?? null;
  });

  readonly viewState = computed(() => {
    if (this.categories.isLoading()) return 'loading';
    if (!this.categories.value()?.length) return 'empty';
    if (this.activeParentId()) return 'children';
    return 'roots';
  });

  selectParent(category: ICategory) {
    if (category.children && category.children.length > 0) {
      this.activeParentId.set(category.id);
    }
  }

  goBack() {
    this.activeParentId.set(null);
  }

  toggleSelection(category: ICategory, isRootLevel: boolean = false) {
    const conf = this.config();
    const isLeaf = !category.children || category.children.length === 0;

    if (isRootLevel && !conf.selectableRoots) return;
    if (isLeaf && !conf.selectableLeaves) return;

    let newSelection = [...this.selectedIds()];
    const isSelected = newSelection.includes(category.id);

    if (conf.multiple) {
      if (isSelected) {
        newSelection = newSelection.filter(id => id !== category.id);
      } else {
        newSelection.push(category.id);
      }
    } else {
      if (isSelected) {
        newSelection = [];
      } else {
        newSelection = [category.id];
      }
    }

    this.selectionChange.emit(newSelection);
  }

  isSelected(categoryId: string): boolean {
    return this.selectedIds().includes(categoryId);
  }
}
