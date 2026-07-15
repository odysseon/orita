import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideCheck, LucideCheckCheck, LucideClock, LucideAlertCircle } from '@lucide/angular';
import { IMessage } from '../../../../../core/services/messaging.types';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe, LucideCheck, LucideCheckCheck, LucideClock, LucideAlertCircle],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css'
})
export class MessageBubble {
  message = input.required<IMessage>();
  // For MVP, we check sender name instead of actual ID since we don't pass current user ID down easily
  isMine = input<boolean>(false);
}
