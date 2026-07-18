import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NearbyItemDto, NearbyItemKind } from '../../../../core/models/discovery';

@Component({
  selector: 'app-nearby-item-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './nearby-item-card.html',
  styleUrls: ['./nearby-item-card.css'],
})
export class NearbyItemCard {
  @Input({ required: true }) item!: NearbyItemDto;
  @Output() actionClicked = new EventEmitter<NearbyItemDto>();

  get hasMedia() {
    return this.item.media && this.item.media.length > 0;
  }
}
