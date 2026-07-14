import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listing-attributes',
  imports: [],
  templateUrl: './listing-attributes.html',
  styleUrl: './listing-attributes.css',
})
export class ListingAttributes {
  @Input() attributes!: any[];
}
