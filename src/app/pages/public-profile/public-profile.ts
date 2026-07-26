import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideShare,  LucideBriefcase, LucideArrowLeft, LucideChevronRight, LucideUserCheck, LucideUserPlus, LucideAlertCircle } from '@lucide/angular';
import { PublicUserService, PublicUserProfile } from '../../core/services/public-user.service';
import { AuthService } from '../../core/services/auth.service';
import { ShareService } from '../../core/services/share.service';
import { Avatar } from '../../shared/ui/identity/avatar/avatar';

import { Button } from '../../shared/ui/atoms/button/button';
import { Skeleton } from '../../shared/ui/atoms/skeleton/skeleton';
import { BusinessCard } from '../../shared/ui/organisms/cards/business-card/business-card';
import { Grid } from '../../shared/ui/layouts/grid/grid';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    Avatar,
    LucideShare,
    LucideArrowLeft,
    LucideUserCheck,
    LucideUserPlus,
    LucideAlertCircle,
    Button,
    Skeleton,
    BusinessCard,
    Grid,
  ],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css'
})
export class PublicProfile implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #publicUserService = inject(PublicUserService);
  #authService = inject(AuthService);
  #shareService = inject(ShareService);

  readonly state = signal<'loading' | 'loaded' | 'error'>('loading');
  readonly profile = signal<PublicUserProfile | null>(null);
  readonly toggleFollowLoading = signal<boolean>(false);

  readonly isCurrentUser = computed(() => {
    const p = this.profile();
    const current = this.#authService.currentUser();
    if (!p || !current) return false;
    return p.username === current.username;
  });

  ngOnInit() {
    this.#route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.loadProfile(username);
      } else {
        this.state.set('error');
      }
    });
  }

  async loadProfile(username: string) {
    this.state.set('loading');
    this.#publicUserService.getProfile(username).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.state.set('loaded');
      },
      error: () => {
        this.state.set('error');
      }
    });
  }

  goBack() {
    history.back();
  }

  shareProfile() {
    const p = this.profile();
    if (!p) return;
    
    this.#shareService.share({
      title: `${p.displayName || p.username} on Orita`,
      text: p.bio || `Check out ${p.username}'s profile on Orita.`,
      url: window.location.href
    });
  }

  async toggleFollow() {
    const p = this.profile();
    if (!p || this.toggleFollowLoading() || this.isCurrentUser()) return;

    // Must be logged in to follow
    if (!this.#authService.token()) {
      this.#router.navigate(['/auth/login'], { queryParams: { returnUrl: this.#router.url } });
      return;
    }

    this.toggleFollowLoading.set(true);
    const wasFollowing = p.isFollowing;

    // Optimistic update
    this.profile.update(current => {
      if (!current) return current;
      return {
        ...current,
        isFollowing: !wasFollowing,
        followersCount: current.followersCount + (wasFollowing ? -1 : 1)
      };
    });

    try {
      if (wasFollowing) {
        await this.#publicUserService.unfollowUser(p.username).toPromise();
      } else {
        await this.#publicUserService.followUser(p.username).toPromise();
      }
    } catch (error) {
      // Revert optimistic update on error
      this.profile.update(current => {
        if (!current) return current;
        return {
          ...current,
          isFollowing: wasFollowing,
          followersCount: current.followersCount + (wasFollowing ? 1 : -1)
        };
      });
    } finally {
      this.toggleFollowLoading.set(false);
    }
  }

  editProfile() {
    this.#router.navigate(['/profile']);
  }
}
