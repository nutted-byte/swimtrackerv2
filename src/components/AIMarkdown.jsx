import Markdown from 'react-markdown';
import { tokens } from '../design/tokens';

/**
 * Shared renderer for AI-generated content.
 *
 * The AI returns Markdown (bold lead-ins, bullet lists, etc.). Rendering it as
 * raw text shows literal `**` / `•`, so every AI surface routes through here.
 * Element styling is tokenised in ONE place — the `@tailwindcss/typography`
 * `prose` plugin is not installed in this project, so we can't lean on it.
 */
const components = {
  p: ({ children }) => (
    <p className={`text-content-secondary leading-relaxed ${tokens.margin.group} last:mb-0`}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className={`space-y-2 ${tokens.margin.group} last:mb-0 list-disc pl-5 marker:text-primary-400`}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={`space-y-2 ${tokens.margin.group} last:mb-0 list-decimal pl-5 marker:text-primary-400`}>{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-content-secondary leading-relaxed pl-1">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className={`${tokens.typography.weights.semibold} text-content-primary`}>{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.lg} ${tokens.typography.weights.semibold} text-content-primary ${tokens.margin.element}`}>{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className={`${tokens.typography.families.display} ${tokens.typography.sizes.base} ${tokens.typography.weights.semibold} text-content-primary ${tokens.margin.element}`}>{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className={`${tokens.typography.weights.semibold} text-content-primary ${tokens.margin.element}`}>{children}</h4>
  ),
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">{children}</a>
  ),
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-dark-bg/60 text-primary-300">{children}</code>
  ),
};

export const AIMarkdown = ({ content, className = '' }) => (
  <div className={`${tokens.typography.sizes.sm} ${className}`.trim()}>
    <Markdown components={components}>{content}</Markdown>
  </div>
);

export default AIMarkdown;
