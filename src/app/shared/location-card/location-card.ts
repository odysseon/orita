import { Component, input, signal, inject } from '@angular/core';
import { Location } from '../../core/services/location.service';
import { FollowService } from '../../core/services/follow.service';
import { ToastService } from '../../core/services/toast';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-location-card',
  standalone: true,
  templateUrl: './location-card.html',
  styleUrl: './location-card.css'
})
export class AppLocationCard {
  location = input.required<Location>();
  
  #followService = inject(FollowService);
  #toast = inject(ToastService);

  readonly isPending = signal(false);

  toggleFollow() {
    if (this.isPending()) return;
    
    const loc = this.location();
    const wasFollowed = loc.isFollowed;
    const newFollowedState = !wasFollowed;
    
    // Optimistic UI
    loc.isFollowed = newFollowedState;
    this.isPending.set(true);

    const request$ = newFollowedState 
      ? this.#followService.followLocation(loc)
      : this.#followService.unfollowLocation(loc.id);

    request$.pipe(
      finalize(() => this.isPending.set(false))
    ).subscribe({
      next: () => {
        // Success: state is already updated optimally
      },
      error: (err) => {
        // Revert on error
        loc.isFollowed = wasFollowed;
        this.#toast.error(
          'Failed to update',
          newFollowedState ? 'Could not follow location.' : 'Could not unfollow location.'
        );
      }
    });
  }
}
