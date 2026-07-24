import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Hero } from './components/hero/hero';
import { Problem } from './components/problem/problem';
import { Belief } from './components/belief/belief';
import { WhyOrita } from './components/why-orita/why-orita';
import { StoreTours } from './components/store-tours/store-tours';
import { BusinessCta } from './components/business-cta/business-cta';
import { FinalCta } from './components/final-cta/final-cta';
import { Footer } from './components/footer/footer';
import { LandingHeader } from '../../shared/ui/organisms/landing-header/landing-header';

@Component({
  selector: 'app-landing',
  imports: [Hero, Problem, Belief, WhyOrita, StoreTours, BusinessCta, FinalCta, Footer, LandingHeader, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  #router = inject(Router);
}
