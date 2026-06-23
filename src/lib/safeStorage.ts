/**
 * Safe local storage service that wraps window.localStorage.
 * If the browser blocks local storage access (e.g. in cross-origin sandboxed iframes),
 * it gracefully falls back to an in-memory storage dictionary to prevent throwing any SecurityError/DOMException.
 */
class SafeStorage {
  private inMemoryDb: Record<string, string> = {};
  private isAvailable: boolean = false;

  constructor() {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
        const testKey = '__storage_test_safe__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        this.isAvailable = true;
      }
    } catch (e) {
      this.isAvailable = false;
      console.warn("localStorage is blocked or restricted. Fallback to in-memory key-value catalog active.");
    }
  }

  getItem(key: string): string | null {
    if (this.isAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        // Fallback
      }
    }
    return key in this.inMemoryDb ? this.inMemoryDb[key] : null;
  }

  setItem(key: string, value: string): void {
    if (this.isAvailable) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        // Fallback
      }
    }
    this.inMemoryDb[key] = String(value);
  }

  removeItem(key: string): void {
    if (this.isAvailable) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        // Fallback
      }
    }
    delete this.inMemoryDb[key];
  }

  clear(): void {
    if (this.isAvailable) {
      try {
        window.localStorage.clear();
        return;
      } catch (e) {
        // Fallback
      }
    }
    this.inMemoryDb = {};
  }
}

export const safeStorage = new SafeStorage();
