import { Children, cloneElement, isValidElement } from 'react';
import { usePrefersReducedMotion } from './prefersReducedMotion';

/**
 * StaggerGroup — orchestrates staggered entrance delays on its children.
 *
 * Replaces the per-child `transition={{ delay: index * 0.05 }}` pattern.
 * Each direct child receives a `style={{ animationDelay, transitionDelay }}`
 * computed from `gap * index + initialDelay`, plus a `data-stagger-index`
 * attribute for tests/assertions.
 *
 * Reduced-motion: every child gets a delay of `0ms` (ordering preserved but
 * no stagger), so accompanying animations still apply their final state.
 *
 * External contract:
 *   - gap         : ms between children (default 90)
 *   - initialDelay: ms before the first child starts (default 0)
 *   - children    : the elements to stagger
 */
export const StaggerGroup = ({
  gap = 90,
  initialDelay = 0,
  children,
  as: Tag = 'div',
  className = '',
  ...rest
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const effectiveGap = reducedMotion ? 0 : gap;

  const wrapped = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    const delayMs = reducedMotion ? 0 : initialDelay + effectiveGap * index;
    const existingStyle = child.props.style || {};
    return cloneElement(child, {
      style: {
        ...existingStyle,
        animationDelay: `${delayMs}ms`,
        transitionDelay: `${delayMs}ms`,
      },
      'data-stagger-index': index,
      'data-stagger-delay': delayMs,
    });
  });

  return (
    <Tag className={className} data-stagger-group {...rest}>
      {wrapped}
    </Tag>
  );
};

export default StaggerGroup;
