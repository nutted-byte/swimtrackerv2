import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { SwimAnalysisPanel } from './SwimAnalysisPanel';
import { Activity, TrendingUp, Clock, Target, Calendar, Sparkles, ChevronUp } from 'lucide-react';
import { tokens } from '../design/tokens';
import { useSwimAnalysis } from '../hooks/useSwimAnalysis';
import { formatDuration } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { ShareModal } from './sharing/ShareModal';

export const LastSwimHero = ({ swim, sessions, onRate, onViewDetails, formatPace, deepAnalysis = null, summary = null }) => {
  const { isDark } = useTheme();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const {
    analysisState,
    handleAnalyzeSwim,
    handleAskQuestion,
    toggleAnalysisPanel,
    closeAnalysisPanel
  } = useSwimAnalysis(swim, sessions);

  if (!swim) return null;

  // Calculate relative time
  const getRelativeTime = (dateString) => {
    const swimDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - swimDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const swimDateTime = new Date(swim.date);
  const fullDate = swimDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const swimTime = swimDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Toggle panel open/closed
  const togglePanel = () => {
    if (!analysisState.isOpen) {
      // Opening - trigger analysis if not already done
      if (!analysisState.analysis) {
        handleAnalyzeSwim();
      } else {
        toggleAnalysisPanel();
      }
    } else {
      // Closing - keep data for reopening
      closeAnalysisPanel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`
        bg-gradient-to-br
        ${isDark
          ? 'from-primary-500/15 to-accent-blue/10'
          : 'from-primary-50 to-blue-50'
        }
      `}>
        {/* Header with Date */}
        <div className="mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`${tokens.typography.families.display} ${tokens.typography.sizes['3xl']} ${tokens.typography.weights.bold} ${isDark ? 'text-primary-400' : 'text-primary-700'} mb-2`}
          >
            Your latest swim
          </motion.h2>
          <div className="flex items-center gap-2">
            <Calendar className={`${tokens.icons.md} ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
            <span className="text-sm text-content-tertiary">
              {fullDate} • {swimTime}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 ${tokens.gap.default} mb-6`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 hover:bg-dark-bg/80'
                : 'bg-white hover:bg-slate-50'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 text-content-tertiary`}>
              <TrendingUp className={tokens.icons.sm} />
              Distance
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {(swim.distance / 1000).toFixed(2)} km
            </p>
            <p className="text-xs mt-1 text-content-tertiary">
              {Math.round(swim.distance / 25)} lengths
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 hover:bg-dark-bg/80'
                : 'bg-white hover:bg-slate-50'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 text-content-tertiary`}>
              <Clock className={tokens.icons.sm} />
              Duration
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {formatDuration(swim.duration)}
            </p>
            <p className="text-xs mt-1 text-content-tertiary">
              min:sec
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 hover:bg-dark-bg/80'
                : 'bg-white hover:bg-slate-50'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 text-content-tertiary`}>
              <Activity className={tokens.icons.sm} />
              Pace
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>
              {formatPace(swim.pace)}
            </p>
            <p className="text-xs mt-1 text-content-tertiary">min/100m</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 hover:bg-dark-bg/80'
                : 'bg-white hover:bg-slate-50'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 text-content-tertiary`}>
              <Target className={tokens.icons.sm} />
              {swim.swolf > 0 ? 'SWOLF' : 'Strokes'}
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              {swim.swolf > 0 ? swim.swolf : swim.strokes.toLocaleString()}
            </p>
            <p className="text-xs mt-1 text-content-tertiary">
              {swim.swolf > 0 ? 'Efficiency score' : 'Total strokes'}
            </p>
          </motion.div>
        </div>

        {/* Swim Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <p className="text-base leading-relaxed text-content-secondary">
              {summary}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center gap-3"
        >
          <button
            onClick={togglePanel}
            disabled={analysisState.loading && !analysisState.isOpen}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysisState.isOpen ? (
              <>
                Close Analysis
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyse My Swim
              </>
            )}
          </button>
          <button
            onClick={() => setShareModalOpen(true)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
              ${isDark
                ? 'bg-dark-bg/60 hover:bg-dark-bg/80'
                : 'bg-white hover:bg-slate-50'
              }
            `}
          >
            Share
          </button>
        </motion.div>

        {/* Analysis Panel */}
        <AnimatePresence>
          {analysisState.isOpen && (
            <SwimAnalysisPanel
              swim={swim}
              analysis={analysisState.analysis}
              onAnalysisGenerated={handleAnalyzeSwim}
              loading={analysisState.loading}
              error={analysisState.error}
            />
          )}
        </AnimatePresence>
      </Card>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        swim={swim}
        type="swim"
      />
    </motion.div>
  );
};
