import { Component, input } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-logo',
  imports: [LucideMapPin],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class LogoComponent {
  readonly className = input<string>('');
}
