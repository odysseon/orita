import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  readonly width = input<string | number>('64');
  readonly height = input<string | number>('64');
  readonly className = input<string>('');
}
