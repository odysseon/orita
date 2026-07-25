import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideCheck } from '@lucide/angular';
import { Avatar } from '../../ui/identity/avatar/avatar';


@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [CommonModule, LucideCheck, Avatar],
  templateUrl: './user-list-item.html',
  styleUrls: ['./user-list-item.css'],
})
export class UserListItem {
  avatarUrl = input<string | null | undefined>();
  displayName = input<string | null | undefined>();
  username = input.required<string>();
  
  selected = input<boolean>(false);
  sent = input<boolean>(false);

  toggle = output<void>();

  onToggle(event: Event) {
    event.stopPropagation();
    this.toggle.emit();
  }
}
