import { Component, input, output, computed, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from 'ur-ui';
import { Card, CardAppearance } from 'ur-ui';
import { NearbyItemDto } from '../../../../../core/models/discovery';

@Component({
  selector: 'ui-post-card',
  imports: [DatePipe, Button, Card],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PostCard {
  item = input.required<NearbyItemDto>();
  appearance = input<CardAppearance>('filled');
  actionClicked = output<{ item: NearbyItemDto, action: 'reply' | 'manage' }>();

  hasMedia = computed(() => {
    const item = this.item();
    return item.media && item.media.length > 0;
  });
}
