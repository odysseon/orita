import { Component, input, signal, inject, output, effect, ViewChild } from '@angular/core';
import { DraftMessageService } from '../../../../core/services/draft-message.service';
import { AttachmentSelection } from '../../../../core/services/messaging.types';
import { Drawer } from 'ur-ui';
import { Tabs, TabList, TabTrigger } from 'ur-ui';
import { Button } from 'ur-ui';
import {
  LucideCamera,
  LucideFileImage,
  LucidePackage,
} from '@lucide/angular';
import { AttachSheetOritaTab } from './attach-sheet-orita-tab/attach-sheet-orita-tab';

@Component({
  selector: 'ui-attach-sheet',
  standalone: true,
  imports: [
    Drawer,
    Tabs, TabList, TabTrigger, Button,
    LucideCamera, LucideFileImage, LucidePackage,
    AttachSheetOritaTab,
  ],
  templateUrl: './attach-sheet.html',
  styleUrl: './attach-sheet.css',
})
export class AttachSheetComponent {
  isOpen = input<boolean>(false);
  conversationId = input<string | undefined>();

  close = output<void>();
  attachmentSelected = output<AttachmentSelection>();

  #draftStore = inject(DraftMessageService);

  activeTab = signal<'ORITA' | 'MEDIA'>('ORITA');

  @ViewChild(AttachSheetOritaTab) private oritaTab?: AttachSheetOritaTab;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.activeTab.set('ORITA');
        // Trigger the orita tab to load its content
        setTimeout(() => this.oritaTab?.load(), 0);
      }
    });
  }

  onTabChanged(val: string | undefined) {
    if (val === 'ORITA' || val === 'MEDIA') {
      this.activeTab.set(val);
    }
  }

  onItemSelected(event: { type: string; targetId: string }): void {
    const cid = this.conversationId();
    if (!cid) return;
    this.#draftStore.attachEmbed(cid, {
      embedType: event.type as any,
      targetId: event.targetId,
    });
    this.onDrawerClose();
  }

  handleFileSelected(event: Event, source: 'CAMERA' | 'GALLERY' | 'FILES') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.attachmentSelected.emit({ source, files });
      this.onDrawerClose();
    }
  }

  onDrawerClose() {
    this.close.emit();
  }
}
