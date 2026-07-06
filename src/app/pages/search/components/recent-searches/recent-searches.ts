import { Component, input, output } from '@angular/core';
import { LucideClock } from '@lucide/angular';

@Component({
  selector: 'app-recent-searches',
  imports: [LucideClock],
  templateUrl: './recent-searches.html',
  styleUrl: './recent-searches.css',
  standalone: true,
})
export class RecentSearches {
  readonly searches = input<string[]>([]);
  readonly recentSelected = output<string>();
}
