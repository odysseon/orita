import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LandingHeader } from '../../../shared/ui/organisms/landing-header/landing-header';
import { Footer } from '../../landing/components/footer/footer';

@Component({
  selector: 'app-legal-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, LandingHeader, Footer],
  templateUrl: './legal-layout.html',
  styleUrl: './legal-layout.css',
})
export class LegalLayout {}
