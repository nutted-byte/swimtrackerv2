import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { DrawOnPath } from './DrawOnPath';

const PATH = 'M0 0 L 100 0';

describe('DrawOnPath', () => {
  beforeEach(() => {
    // Force getTotalLength to a known value.
    SVGElement.prototype.getTotalLength = () => 120;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a <path> with the supplied d attribute', () => {
    const { container } = render(
      <svg>
        <DrawOnPath d={PATH} stroke="white" strokeWidth="2" />
      </svg>
    );
    const path = container.querySelector('path[data-draw-on-path]');
    expect(path).not.toBeNull();
    expect(path.getAttribute('d')).toBe(PATH);
  });

  it('sets stroke-dasharray to the measured path length on mount', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <DrawOnPath d={PATH} />
      </svg>
    );
    // Effects run after mount; flush microtasks.
    await act(async () => {
      await Promise.resolve();
    });
    const path = container.querySelector('path[data-draw-on-path]');
    expect(path.style.strokeDasharray).toBe('120');
  });

  it('transitions stroke-dashoffset from length to 0 after mount', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <svg>
        <DrawOnPath d={PATH} duration={600} />
      </svg>
    );
    // Flush the mount effect.
    await act(async () => {
      await Promise.resolve();
    });
    // Flush the requestAnimationFrame inside the effect.
    await act(async () => {
      vi.advanceTimersByTime(20);
      await Promise.resolve();
    });
    const path = container.querySelector('path[data-draw-on-path]');
    expect(Number(path.style.strokeDashoffset)).toBe(0);
    expect(path.style.transition).toContain('stroke-dashoffset');
  });

  it('with prefers-reduced-motion, renders final state immediately and without transition', async () => {
    window.matchMedia = (query) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { container } = render(
      <svg>
        <DrawOnPath d={PATH} />
      </svg>
    );
    await act(async () => {
      await Promise.resolve();
    });
    const path = container.querySelector('path[data-draw-on-path]');
    expect(Number(path.style.strokeDashoffset)).toBe(0);
    expect(path.style.transition).toBe('none');
  });
});
