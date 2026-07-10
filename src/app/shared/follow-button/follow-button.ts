import { Component, input, model, signal, inject } from '@angular/core';
import { LucideHeart } from '@lucide/angular';
import { ToastService } from '../../core/services/toast';
import { FollowService, FollowType } from '../../core/services/follow.service';

@Component({
  selector: 'app-follow-button',
  imports: [LucideHeart],
  templateUrl: './follow-button.html',
  styleUrl: './follow-button.css',
})
export class FollowButton {
  readonly targetId = input.required<string>();
  readonly targetType = input.required<FollowType>();
  readonly followed = model<boolean>(false);

  // Style configurations
  readonly variant = input<'primary' | 'secondary' | 'ghost' | 'icon' | 'action' | 'overlay'>(
    'action',
  );

  readonly following = signal(false);

  #followService = inject(FollowService);
  #toast = inject(ToastService);

  async onToggle(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (this.following()) return;
    this.following.set(true);

    const currentlyFollowed = this.followed();
    // Optimistic update
    this.followed.set(!currentlyFollowed);

    try {
      if (currentlyFollowed) {
        await this.#followService.unfollow(this.targetType(), this.targetId()).toPromise();
        this.#toast.info('Unfollowed');
      } else {
        await this.#followService.follow(this.targetType(), this.targetId()).toPromise();
        this.#toast.success('Following');
      }
    } catch {
      // Revert on failure
      this.followed.set(currentlyFollowed);
      this.#toast.error('Could not update follow status');
    } finally {
      this.following.set(false);
    }
  }
}
