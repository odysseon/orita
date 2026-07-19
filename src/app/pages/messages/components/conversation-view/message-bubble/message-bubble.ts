import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideCheckCheck, LucideClock, LucideAlertCircle } from '@lucide/angular';
import { IMessage } from '../../../../../core/services/messaging.types';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe, RouterLink, LucideCheck, LucideCheckCheck, LucideClock, LucideAlertCircle],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css'
})
export class MessageBubble {
  message = input.required<IMessage>();
  // For MVP, we check sender name instead of actual ID since we don't pass current user ID down easily
  isMine = input<boolean>(false);

  retry = output<void>();
  discard = output<void>();
}
