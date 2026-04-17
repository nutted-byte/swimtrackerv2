import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { StaggerGroup } from './StaggerGroup';

describe('StaggerGroup', () => {
  it('applies incrementally increasing delays to direct children', () => {
    const { container } = render(
      <StaggerGroup gap={100}>
        <div>first</div>
        <div>second</div>
        <div>third</div>
      </StaggerGroup>
    );
    const kids = container.querySelectorAll('[data-stagger-index]');
    expect(kids).toHaveLength(3);
    expect(kids[0].getAttribute('data-stagger-delay')).toBe('0');
    expect(kids[1].getAttribute('data-stagger-delay')).toBe('100');
    expect(kids[2].getAttribute('data-stagger-delay')).toBe('200');
  });

  it('preserves child order', () => {
    const { container } = render(
      <StaggerGroup gap={50}>
        <div>alpha</div>
        <div>beta</div>
        <div>gamma</div>
      </StaggerGroup>
    );
    const kids = container.querySelectorAll('[data-stagger-index]');
    expect(kids[0].textContent).toBe('alpha');
    expect(kids[1].textContent).toBe('beta');
    expect(kids[2].textContent).toBe('gamma');
  });

  it('with gap=0, no delay is applied to any child', () => {
    const { container } = render(
      <StaggerGroup gap={0}>
        <div>a</div>
        <div>b</div>
      </StaggerGroup>
    );
    const kids = container.querySelectorAll('[data-stagger-index]');
    kids.forEach((k) => expect(k.getAttribute('data-stagger-delay')).toBe('0'));
  });

  it('initialDelay offsets all children uniformly', () => {
    const { container } = render(
      <StaggerGroup gap={50} initialDelay={200}>
        <div>a</div>
        <div>b</div>
      </StaggerGroup>
    );
    const kids = container.querySelectorAll('[data-stagger-index]');
    expect(kids[0].getAttribute('data-stagger-delay')).toBe('200');
    expect(kids[1].getAttribute('data-stagger-delay')).toBe('250');
  });

  it('with prefers-reduced-motion, all children receive 0 delay regardless of gap', () => {
    window.matchMedia = (query) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { container } = render(
      <StaggerGroup gap={200} initialDelay={500}>
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </StaggerGroup>
    );
    const kids = container.querySelectorAll('[data-stagger-index]');
    kids.forEach((k) => expect(k.getAttribute('data-stagger-delay')).toBe('0'));
  });
});
