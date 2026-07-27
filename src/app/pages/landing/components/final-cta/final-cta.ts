import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Section } from '../section/section';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [Section, RouterLink],
  templateUrl: './final-cta.html',
  styleUrl: './final-cta.css',
  
})
export class FinalCta {}
