import { Component, input, output, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/ui/atoms/button/button';
import { NearbyItemDto, NearbyItemKind } from '../../../../core/models/discovery';

@Component({
  selector: 'app-nearby-item-card',
  imports: [DatePipe, Button],
  templateUrl: './nearby-item-card.html',
  styleUrls: ['./nearby-item-card.css'],
})
export class NearbyItemCard {
  item = input.required<NearbyItemDto>();
  actionClicked = output<{ item: NearbyItemDto, action: 'reply' | 'manage' }>();

  hasMedia = computed(() => {
    const item = this.item();
    return item.media && item.media.length > 0;
  });
}
