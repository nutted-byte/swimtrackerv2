import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { CountUpNumber } from './CountUpNumber';

// Drive requestAnimationFrame deterministically.
const setupRaf = () => {
  let now = 0;
  const callbacks = new Map();
  let next = 1;
  vi.stubGlobal('performance', { now: () => now });
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    const id = next++;
    callbacks.set(id, cb);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id) => callbacks.delete(id));
  return {
    advance: (ms) => {
      now += ms;
      const pending = Array.from(callbacks.entries());
      callbacks.clear();
      pending.forEach(([, cb]) => cb(now));
    },
  };
};

describe('CountUpNumber', () => {
  let raf;
  beforeEach(() => {
    raf = setupRaf();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the final formatted value after the full duration elapses', () => {
    const { container } = render(
      <CountUpNumber value={1000} duration={1000} format={(n) => `${Math.round(n)}m`} />
    );
    // Drive time forward past the duration. Loop because each tick schedules the next.
    act(() => {
      for (let i = 0; i < 20; i++) raf.advance(100);
    });
    expect(container.textContent).toBe('1000m');
  });

  it('renders an intermediate value (0 < v < target) partway through', () => {
    const { container } = render(
      <CountUpNumber value={1000} duration={1000} format={(n) => Math.round(n)} />
    );
    act(() => {
      raf.advance(400);
    });
    const rendered = Number(container.textContent);
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(1000);
  });

  it('fires onComplete exactly once when the animation settles', () => {
    const onComplete = vi.fn();
    render(
      <CountUpNumber value={500} duration={400} onComplete={onComplete} />
    );
    act(() => {
      for (let i = 0; i < 10; i++) raf.advance(100);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('when prefers-reduced-motion is set, renders the final value immediately', () => {
    window.matchMedia = (query) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { container } = render(
      <CountUpNumber value={42} format={(n) => `${Math.round(n)}`} />
    );
    // No RAF frames advanced.
    expect(container.textContent).toBe('42');
  });

  it('does not throw when unmounted mid-animation', () => {
    const { unmount } = render(
      <CountUpNumber value={1000} duration={5000} />
    );
    act(() => {
      raf.advance(200);
    });
    expect(() => unmount()).not.toThrow();
  });
});
