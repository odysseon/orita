import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareIntent, ShareTarget, UserSearchResult } from '../../core/types/share.types.js';
import { ShareFacade } from '../../core/facades/share/share.facade.js';
import { PeopleSearchComponent } from '../people-search/people-search.js';
import { NativeShareService } from '../../core/facades/share/native-share.service.js';
import { LucideLink, LucideShare } from '@lucide/angular';

@Component({
  selector: 'app-share-sheet',
  standalone: true,
  imports: [CommonModule, PeopleSearchComponent, LucideLink, LucideShare],
  templateUrl: './share-sheet.html',
  styleUrl: './share-sheet.css',
})
export class ShareSheetComponent {
  intent = input.required<ShareIntent>();
  
  #shareFacade = inject(ShareFacade);
  #nativeShare = inject(NativeShareService);

  recentChats = this.#shareFacade.recentChats;
  status = this.#shareFacade.status;

  get canNativeShare(): boolean {
    return this.#nativeShare.isSupported;
  }

  onUserSelected(user: UserSearchResult) {
    this.#shareFacade.share(this.intent(), { kind: 'user', userId: user.id });
  }

  onConversationSelected(conversationId: string) {
    this.#shareFacade.share(this.intent(), { kind: 'conversation', conversationId });
  }

  copyLink() {
    this.#shareFacade.copyLink(this.intent());
  }

  nativeShare() {
    this.#shareFacade.nativeShare(this.intent());
  }
}
