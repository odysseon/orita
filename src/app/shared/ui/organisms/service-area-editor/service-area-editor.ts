import { Component, input, output, signal, effect, computed, inject } from '@angular/core';
import { IBaseServiceArea, ServiceAreaType } from '../../../../pages/profile/business/business.interface';
import { Drawer } from '@odysseon/ur-ui';
import { Button } from '@odysseon/ur-ui';
import { InputDirective } from '@odysseon/ur-ui';
import { AppFormField } from '@odysseon/ur-ui';
import { LucideX, LucideMapPin, LucideGlobe, LucideMap } from '@lucide/angular';

export interface ServiceAreaEditorSaveEvent {
  area: IBaseServiceArea;
}

@Component({
  selector: 'ui-service-area-editor',
  imports: [Drawer, Button, InputDirective, AppFormField, LucideMapPin, LucideGlobe, LucideMap],
  templateUrl: './service-area-editor.html',
  styleUrl: './service-area-editor.css',
})
export class ServiceAreaEditor {
  isOpen = input<boolean>(false);
  areaToEdit = input<IBaseServiceArea | null>(null);
  businessCountry = input<string>('Nigeria');
  allowDelete = input<boolean>(false);

  save = output<ServiceAreaEditorSaveEvent>();
  delete = output<void>();
  close = output<void>();

  // Form State
  mode = signal<'RADIUS' | 'ADMIN_REGION' | 'NATIONWIDE' | 'REMOTE'>('RADIUS');
  
  // Base State
  areaName = signal<string>('');
  showAdvanced = signal<boolean>(false);
  
  // Radius state
  radiusKm = signal<number>(10);
  isCustomRadius = signal<boolean>(false);

  // Admin Region state (Simplified MVP)
  // Usually this would use a real cascading dropdown from an AdminRegionService.
  // For MVP UI building, we'll mock the cascade.
  selectedState = signal<string>('');
  selectedLga = signal<string>('');

  constructor() {
    effect(() => {
      const area = this.areaToEdit();
      if (area) {
        this.areaName.set(area.name ?? '');
        this.showAdvanced.set(!!area.name);
        if (area.type === 'RADIUS') {
          this.mode.set('RADIUS');
          this.radiusKm.set(area.radiusKm ?? 10);
          if (![5, 10, 20, 50].includes(this.radiusKm())) {
            this.isCustomRadius.set(true);
          } else {
            this.isCustomRadius.set(false);
          }
        } else if (area.type === 'ADMIN_REGION') {
          this.mode.set('ADMIN_REGION');
          // Mock setting the state/lga from the ID
          this.selectedState.set(area.administrativeRegionId ?? '');
        } else if (area.type === 'NATIONWIDE') {
          this.mode.set('NATIONWIDE');
        } else if (area.type === 'REMOTE') {
          this.mode.set('REMOTE');
        }
      } else {
        // Reset to default
        this.areaName.set('');
        this.showAdvanced.set(false);
        this.mode.set('RADIUS');
        this.radiusKm.set(10);
        this.isCustomRadius.set(false);
        this.selectedState.set('');
        this.selectedLga.set('');
      }
    }, { allowSignalWrites: true });
  }

  setMode(m: 'RADIUS' | 'ADMIN_REGION' | 'NATIONWIDE' | 'REMOTE') {
    this.mode.set(m);
  }

  setRadius(km: number | 'CUSTOM') {
    if (km === 'CUSTOM') {
      this.isCustomRadius.set(true);
    } else {
      this.isCustomRadius.set(false);
      this.radiusKm.set(km);
    }
  }

  onCustomRadiusChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      this.radiusKm.set(num);
    }
  }

  onSave() {
    const m = this.mode();
    let result: IBaseServiceArea;

    if (m === 'RADIUS') {
      result = {
        id: this.areaToEdit()?.id,
        name: this.areaName() || null,
        type: 'RADIUS',
        radiusKm: this.radiusKm(),
        enabled: this.areaToEdit()?.enabled ?? true,
      };
    } else if (m === 'ADMIN_REGION') {
      result = {
        id: this.areaToEdit()?.id,
        name: this.areaName() || null,
        type: 'ADMIN_REGION',
        // In real app, we'd pass the LGA or State ID.
        administrativeRegionId: this.selectedLga() || this.selectedState() || 'NG',
        enabled: this.areaToEdit()?.enabled ?? true,
      };
    } else if (m === 'NATIONWIDE') {
      result = {
        id: this.areaToEdit()?.id,
        name: this.areaName() || null,
        type: 'NATIONWIDE',
        enabled: this.areaToEdit()?.enabled ?? true,
      };
    } else {
      result = {
        id: this.areaToEdit()?.id,
        name: this.areaName() || null,
        type: 'REMOTE',
        enabled: this.areaToEdit()?.enabled ?? true,
      };
    }

    this.save.emit({ area: result });
  }
}
