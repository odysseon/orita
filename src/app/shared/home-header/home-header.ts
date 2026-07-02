import { Component } from '@angular/core';
import { Logo } from '../logo/logo';

@Component({
  selector: 'ui-home-header',
  imports: [Logo],
  templateUrl: './home-header.html',
  styleUrl: './home-header.css',
})
export class HomeHeader {}
