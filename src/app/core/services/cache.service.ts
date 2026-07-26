import { Service, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export enum CacheKeys {
  PROFILE = 'PROFILE_v1',
  DRAFTS = 'DRAFTS_v1',
  CONVERSATIONS = 'CONVERSATIONS_v1',
}

export interface CacheEntry<T> {
  value: T;
  updatedAt: number;
  version: string;
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export class LocalStorageAdapter implements StorageAdapter {
  private readonly storage: Storage | null = null;

  constructor(platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.storage = window.localStorage;
    }
  }

  getItem(key: string): string | null {
    if (!this.storage) return null;
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(key, value);
    } catch (err) {
      console.warn('LocalStorage limit exceeded or disabled', err);
    }
  }

  removeItem(key: string): void {
    if (!this.storage) return;
    try {
      this.storage.removeItem(key);
    } catch {}
  }

  clear(): void {
    if (!this.storage) return;
    try {
      this.storage.clear();
    } catch {}
  }
}

@Service()
export class CacheService {
  private readonly SCHEMA_VERSION = 'v1';
  private readonly SCHEMA_KEY = 'ORITA_CACHE_SCHEMA_VERSION';
  
  private adapter: StorageAdapter;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.adapter = new LocalStorageAdapter(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      this.verifySchemaVersion();
    }
  }

  private verifySchemaVersion(): void {
    const currentVersion = this.adapter.getItem(this.SCHEMA_KEY);
    if (currentVersion !== this.SCHEMA_VERSION) {
      console.log(`Cache schema version mismatch (Expected ${this.SCHEMA_VERSION}, got ${currentVersion}). Clearing cache.`);
      this.adapter.clear();
      this.adapter.setItem(this.SCHEMA_KEY, this.SCHEMA_VERSION);
    }
  }

  get<T>(key: CacheKeys): T | null {
    const raw = this.adapter.getItem(key);
    if (!raw) return null;

    try {
      const entry = JSON.parse(raw) as CacheEntry<T>;
      // If version in key changed, it wouldn't match the key, but we can also verify schema
      return entry.value;
    } catch {
      return null;
    }
  }

  set<T>(key: CacheKeys, value: T): void {
    const entry: CacheEntry<T> = {
      value,
      updatedAt: Date.now(),
      version: this.SCHEMA_VERSION,
    };
    this.adapter.setItem(key, JSON.stringify(entry));
  }

  remove(key: CacheKeys): void {
    this.adapter.removeItem(key);
  }
}
