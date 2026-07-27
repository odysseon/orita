import { InjectionToken } from '@angular/core';

export interface FollowButtonI18n {
  followed: string;
  following: string;
}

export const FOLLOW_BUTTON_I18N = new InjectionToken<FollowButtonI18n>('follow-button.i18n', {
  factory: () => ({
    followed: 'Follow',
    following: 'Following',
  }),
});
