import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, Zap, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Expandable analysis panel for a specific swim
 * Shows AI-generated insights and Q&A interface
 */
export const SwimAnalysisPanel = memo(({
  swim,
  analysis,
  onAnalysisGenerated,
  loading,
  error,
}) => {

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="mt-4 pt-4 border-t border-dark-border/50">
        {/* Analysis Section */}
        {analysis && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h3 className="font-display text-lg font-semibold">AI Analysis</h3>
            </div>

            <div className="bg-dark-bg/30 rounded-lg p-4 mb-4">
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {analysis.content}
                </p>
              </div>

              {analysis.usage && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                  <Zap className="w-3 h-3" />
                  <span>{analysis.usage.inputTokens + analysis.usage.outputTokens} tokens</span>
                  {analysis.cached && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                      Cached
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Link to Ask AI page */}
            <Link
              to="/ask"
              state={{ initialContext: analysis.content, swimId: swim.id }}
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors group"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask follow-up questions about this swim</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Loading State for Initial Analysis */}
        {!analysis && loading && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-400 animate-pulse" />
              <h3 className="font-display text-lg font-semibold">Analysing Swim...</h3>
            </div>
            <div className="bg-dark-bg/30 rounded-lg p-8 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Generating insights...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-1">Analysis Failed</p>
                <p className="text-sm text-gray-400">{error}</p>
                {!analysis && (
                  <button
                    onClick={onAnalysisGenerated}
                    className="mt-3 text-sm text-primary-400 hover:text-primary-300 font-medium"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

SwimAnalysisPanel.displayName = 'SwimAnalysisPanel';
