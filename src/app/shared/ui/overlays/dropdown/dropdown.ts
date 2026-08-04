import {
  Component,
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { AnchorPlacement, AnchorPosition, AnchorPositionService } from '../anchor-position.service';
import { Drawer } from '../drawer/drawer';

@Directive({
  selector: '[appDropdownTrigger]',
  standalone: true,
  providers: [AnchorPositionService],
  host: {
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'isOpen()',
    '(click)': 'toggle()',
  },
})
export class DropdownTrigger implements OnDestroy {
  appDropdownTrigger = input.required<TemplateRef<any>>();
  position = input<AnchorPlacement>('bottom-start');

  private vcr = inject(ViewContainerRef);
  private injector = inject(Injector);
  private el = inject(ElementRef<HTMLElement>);
  private anchorService = inject(AnchorPositionService);

  isOpen = signal(false);
  private isMobile = signal(false);
  private desktopRef: ComponentRef<DropdownDesktop> | null = null;
  private mobileRef: ComponentRef<DropdownMobile> | null = null;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const destroyRef = inject(DestroyRef);

    if (isPlatformBrowser(platformId)) {
      const mql = window.matchMedia('(max-width: 37.5rem)');
      this.isMobile.set(mql.matches);
      const listener = (e: MediaQueryListEvent) => {
        this.isMobile.set(e.matches);
        if (this.isOpen()) this.close();
      };
      mql.addEventListener('change', listener);
      destroyRef.onDestroy(() => mql.removeEventListener('change', listener));
    }

    this.anchorService.init({
      trigger: () => this.el.nativeElement,
      overlay: () => this.desktopRef?.instance.el.nativeElement || null,
      placement: () => this.position(),
      isOpen: () => this.isOpen() && !this.isMobile(),
      offset: 8,
    });

    effect(() => {
      const pos = this.anchorService.position();
      if (this.desktopRef) {
        this.desktopRef.instance.pos.set(pos);
      }
    });

    effect(() => {
      if (this.isOpen() && !this.isMobile() && !this.anchorService.triggerVisible()) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  open() {
    if (this.isOpen()) return;
    this.isOpen.set(true);

    const childInjector = Injector.create({
      providers: [{ provide: DropdownTrigger, useValue: this }],
      parent: this.injector,
    });

    if (this.isMobile()) {
      this.mobileRef = this.vcr.createComponent(DropdownMobile, { injector: childInjector });
      this.mobileRef.instance.template.set(this.appDropdownTrigger());
      document.body.appendChild(this.mobileRef.location.nativeElement);
    } else {
      this.desktopRef = this.vcr.createComponent(DropdownDesktop, { injector: childInjector });
      this.desktopRef.instance.template.set(this.appDropdownTrigger());
      document.body.appendChild(this.desktopRef.location.nativeElement);

      setTimeout(() => {
        const first = this.desktopRef?.location.nativeElement.querySelector('[role="menuitem"]') as HTMLElement | null;
        first?.focus();
      });
    }
  }

  close() {
    if (!this.isOpen()) return;
    this.isOpen.set(false);

    if (this.desktopRef) {
      this.desktopRef.destroy();
      this.desktopRef = null;
    }
    if (this.mobileRef) {
      this.mobileRef.destroy();
      this.mobileRef = null;
    }
  }

  focus() {
    this.el.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isOpen() || this.isMobile()) return;
    const target = event.target as HTMLElement;
    const clickedInsideTrigger = this.el.nativeElement.contains(target);
    const clickedInsideOverlay = this.desktopRef?.location.nativeElement.contains(target);

    if (!clickedInsideTrigger && !clickedInsideOverlay) {
      this.close();
    }
  }

  ngOnDestroy() {
    this.close();
  }
}

@Component({
  selector: 'app-dropdown-desktop',
  standalone: true,
  imports: [NgTemplateOutlet],
  styleUrl: './dropdown.css',
  template: `<ng-container *ngTemplateOutlet="template()"></ng-container>`,
  host: {
    'class': 'app-dropdown-overlay',
    '[style.top]': '`calc(var(--size-1) * ${pos()?.top ?? 0})`',
    '[style.left]': '`calc(var(--size-1) * ${pos()?.left ?? 0})`',
    '[style.opacity]': 'pos() ? 1 : 0',
    '[style.pointer-events]': 'pos() ? "auto" : "none"',
  }
})
export class DropdownDesktop {
  template = signal<TemplateRef<any> | null>(null);
  pos = signal<AnchorPosition | null>(null);
  el = inject(ElementRef<HTMLElement>);
  trigger = inject(DropdownTrigger);

  @HostListener('document:keydown.escape')
  onEscape() {
    this.trigger.close();
    this.trigger.focus();
  }
}

@Component({
  selector: 'app-dropdown-mobile',
  standalone: true,
  imports: [NgTemplateOutlet, Drawer],
  template: `
    <app-drawer [(open)]="isOpen" position="bottom" size="sm">
      <ng-container *ngTemplateOutlet="template()"></ng-container>
    </app-drawer>
  `,
})
export class DropdownMobile {
  template = signal<TemplateRef<any> | null>(null);
  isOpen = signal(true);
  trigger = inject(DropdownTrigger);

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.trigger.close();
        this.trigger.focus();
      }
    });
  }
}
