import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: '<div class="spinner"></div>',
  styleUrl: './spinner.css',
  host: {
    'role': 'status'
  }
})
export class Spinner {}
