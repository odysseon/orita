import { Component, computed, input, output } from '@angular/core';
import { LucideXCircle, LucideAlertTriangle } from '@lucide/angular';
import { PublicationIssue } from '../../core/services/business-profile.service';
import { Drawer } from '@odysseon/ur-ui';

import { List, ListItem, ListItemStart, ListItemContent, ListItemTitle } from '@odysseon/ur-ui';
import { Button } from '@odysseon/ur-ui';

@Component({
  selector: 'app-publication-readiness',
  imports: [Drawer, LucideXCircle, LucideAlertTriangle, Button, List, ListItem, ListItemStart, ListItemContent, ListItemTitle],
  templateUrl: './publication-readiness.html',
  styleUrl: './publication-readiness.css',
})
export class PublicationReadinessDialog {
  readonly isOpen = input.required<boolean>();
  readonly issues = input.required<PublicationIssue[]>();
  
  readonly close = output<void>();

  readonly errors = computed(() => this.issues().filter(i => i.severity === 'ERROR'));
  readonly warnings = computed(() => this.issues().filter(i => i.severity === 'WARNING'));

  onClose() {
    this.close.emit();
  }
}
