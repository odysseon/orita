import { Component } from '@angular/core';
import { Logo } from '../logo/logo';

@Component({
  selector: 'ui-app-header',
  imports: [Logo],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {}
