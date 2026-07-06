import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-trending-categories',
  templateUrl: './trending-categories.html',
  styleUrl: './trending-categories.css',
  standalone: true,
})
export class TrendingCategories {
  readonly categories = input<{id: string; name: string}[]>([]);
  readonly categorySelected = output<string>();
}
