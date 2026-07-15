import { Component, input } from '@angular/core';

@Component({
  selector: 'app-listing-attributes',
  imports: [],
  templateUrl: './listing-attributes.html',
  styleUrl: './listing-attributes.css',
})
export class ListingAttributes {
  attributes = input.required<any[]>();
}
