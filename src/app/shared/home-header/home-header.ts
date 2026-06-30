import { Component, output } from '@angular/core';
import { Logo } from '../logo/logo';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'ui-home-header',
  imports: [Logo, LucideMapPin],
  templateUrl: './home-header.html',
  styleUrl: './home-header.css',
})
export class HomeHeader {
  profileClicked = output<void>();
}
