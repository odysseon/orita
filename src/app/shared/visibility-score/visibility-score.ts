import { Component, computed, input, output } from '@angular/core';
import { IBusinessProfile } from '../../pages/profile/business/business.interface';
import { LucideCircle } from '@lucide/angular';
import { RouterLink } from '@angular/router';

interface ScoreItem {
  id: string;
  label: string;
  isComplete: boolean;
  points: number;
  actionUrl?: string | null;
  actionId?: string | null;
}

@Component({
  selector: 'app-visibility-score',
  imports: [LucideCircle, RouterLink],
  templateUrl: './visibility-score.html',
  styleUrl: './visibility-score.css',
})
export class VisibilityScore {
  readonly business = input.required<IBusinessProfile>();
  readonly listingCount = input.required<number>();
  readonly actionTriggered = output<string>();

  readonly scoreItems = computed<ScoreItem[]>(() => {
    const biz = this.business();
    return [
      { id: 'cover', label: 'Add cover photo', isComplete: !!biz.coverUrl, points: 20, actionUrl: '/profile/business/edit' },
      { id: 'listing', label: 'Create first listing', isComplete: this.listingCount() > 0, points: 20, actionId: 'create-listing' },
      { id: 'logo', label: 'Upload logo', isComplete: !!biz.avatarUrl, points: 10, actionUrl: '/profile/business/edit' },
      { id: 'phone', label: 'Add phone number', isComplete: !!biz.phoneNumber, points: 10, actionUrl: '/profile/business/edit' },
      { id: 'desc', label: 'Add description', isComplete: !!biz.description, points: 10, actionUrl: '/profile/business/edit' },
      { id: 'location', label: 'Add location', isComplete: !!biz.latitude, points: 10, actionUrl: '/profile/business/edit' },
      { id: 'name', label: 'Business name', isComplete: !!biz.name, points: 10 },
      { id: 'category', label: 'Category', isComplete: !!biz.primaryCategoryId, points: 10 },
      
      // Secondary items (don't count towards the 100 points)
      { id: 'verify', label: 'Request Verification', isComplete: biz.verificationStatus === 'VERIFIED' || biz.verificationStatus === 'PENDING', points: 0, actionId: 'request-verify' },
    ];
  });

  readonly totalScore = computed(() => {
    return this.scoreItems().reduce((acc, item) => item.isComplete ? acc + item.points : acc, 0);
  });

  readonly incompleteItems = computed(() => {
    // Only show incomplete items that have an action, prioritizing cover and listing
    return this.scoreItems().filter(item => !item.isComplete && (item.actionUrl || item.actionId));
  });

  triggerAction(item: ScoreItem) {
    if (item.actionId) {
      this.actionTriggered.emit(item.actionId);
    }
  }
}
