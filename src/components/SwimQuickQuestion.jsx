import { memo } from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Clickable suggested question button
 * @param {string} question - The question text
 * @param {function} onClick - Handler when clicked
 * @param {boolean} disabled - Whether button is disabled
 */
export const SwimQuickQuestion = memo(({ question, onClick, disabled = false }) => {
  return (
    <button
      onClick={() => onClick(question)}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2.5 bg-dark-card hover:bg-dark-card/70 border border-dark-border/50 hover:border-primary-500/50 rounded-lg transition-all text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <MessageCircle className="w-4 h-4 text-primary-400 flex-shrink-0 group-hover:text-primary-300 transition-colors" />
      <span className="text-content-secondary group-hover:text-white transition-colors">
        {question}
      </span>
    </button>
  );
});

SwimQuickQuestion.displayName = 'SwimQuickQuestion';
