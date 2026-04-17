import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia; motion primitives rely on it.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

// jsdom does not implement getTotalLength on SVGPathElement.
if (typeof SVGElement !== 'undefined' && !SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = function () {
    return 100;
  };
}

// Simple IntersectionObserver stub: never fires — components must also have
// a non-observer fallback. Tests that rely on intersection can re-stub this.
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
