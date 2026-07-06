import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.html',
  styleUrl: './section.css',
  standalone: true,
})
export class AppSection {
  readonly title = input<string>();
}
