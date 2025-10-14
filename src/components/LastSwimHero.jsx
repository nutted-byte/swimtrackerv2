import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { SwimAnalysisPanel } from './SwimAnalysisPanel';
import { Activity, TrendingUp, Clock, Target, ThumbsUp, ThumbsDown, ArrowRight, Calendar, Zap, BarChart2, TrendingDown, Flame, Sparkles, ChevronUp } from 'lucide-react';
import { tokens } from '../design/tokens';
import { useSwimAnalysis } from '../hooks/useSwimAnalysis';

export const LastSwimHero = ({ swim, sessions, onRate, onViewDetails, formatPace, deepAnalysis = null, summary = null }) => {
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
      <Card className="bg-gradient-to-br from-primary-500/15 to-accent-blue/10 border-primary-500/30">
        {/* Header with Date and Rating */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className={`${tokens.icons.md} text-primary-400`} />
              <span className="text-sm text-gray-400">
                {fullDate} • {swimTime}
              </span>
            </div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${tokens.typography.families.display} ${tokens.typography.sizes['3xl']} ${tokens.typography.weights.bold} text-primary-400`}
            >
              {getRelativeTime(swim.date)}
            </motion.h2>
          </div>

          {/* Rating buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-dark-bg/50 rounded-lg p-1">
              <button
                onClick={() => onRate(swim.id, swim.rating === true ? null : true)}
                className={`p-2 rounded-md transition-all ${
                  swim.rating === true
                    ? 'bg-accent-blue text-white'
                    : 'hover:bg-dark-card text-gray-400'
                }`}
                title="Good swim"
              >
                <ThumbsUp className={tokens.icons.md} />
              </button>
              <button
                onClick={() => onRate(swim.id, swim.rating === false ? null : false)}
                className={`p-2 rounded-md transition-all ${
                  swim.rating === false
                    ? 'bg-accent-coral text-white'
                    : 'hover:bg-dark-card text-gray-400'
                }`}
                title="Could be better"
              >
                <ThumbsDown className={tokens.icons.md} />
              </button>
            </div>
          </div>
        </div>

        {/* Swim Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-base text-gray-300 leading-relaxed">
              {summary}
            </p>
          </motion.div>
        )}

        {/* Pacing Strategy Badge */}
        {deepAnalysis?.pacing?.strategy && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-bg/60 border border-dark-border/50 rounded-lg">
              {deepAnalysis.pacing.strategy === 'negative' && (
                <>
                  <Zap className={`${tokens.icons.sm} text-accent-blue`} />
                  <span className="text-sm font-medium text-accent-blue">Negative Split</span>
                </>
              )}
              {deepAnalysis.pacing.strategy === 'even' && (
                <>
                  <BarChart2 className={`${tokens.icons.sm} text-primary-400`} />
                  <span className="text-sm font-medium text-primary-400">Even Pace</span>
                </>
              )}
              {deepAnalysis.pacing.strategy === 'positive' && (
                <>
                  <TrendingDown className={`${tokens.icons.sm} text-gray-400`} />
                  <span className="text-sm font-medium text-gray-400">Positive Split</span>
                </>
              )}
              <span className="text-xs text-gray-500 ml-1">
                ({deepAnalysis.pacing.consistency})
              </span>
            </div>
          </motion.div>
        )}

        {/* Key Metrics Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 ${tokens.gap.default} mb-6`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50"
          >
            <div className={`flex items-center ${tokens.gap.tight} text-gray-400 text-sm mb-2`}>
              <TrendingUp className={tokens.icons.sm} />
              Distance
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {(swim.distance / 1000).toFixed(2)} km
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(swim.distance / 25)} lengths
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50"
          >
            <div className={`flex items-center ${tokens.gap.tight} text-gray-400 text-sm mb-2`}>
              <Clock className={tokens.icons.sm} />
              Duration
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {swim.duration} min
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.floor(swim.duration / 60)}h {swim.duration % 60}m
            </p>
            {swim.calories > 0 && (
              <div className="mt-2 pt-2 border-t border-dark-border/30 flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-accent-coral" />
                <span className="text-xs text-gray-400">{swim.calories} cal</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50"
          >
            <div className={`flex items-center ${tokens.gap.tight} text-gray-400 text-sm mb-2`}>
              <Activity className={tokens.icons.sm} />
              Pace
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>
              {formatPace(swim.pace)}
            </p>
            <p className="text-xs text-gray-500 mt-1">min/100m</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50"
          >
            <div className={`flex items-center ${tokens.gap.tight} text-gray-400 text-sm mb-2`}>
              <Target className={tokens.icons.sm} />
              {swim.swolf > 0 ? 'SWOLF' : 'Strokes'}
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-primary-400`}>
              {swim.swolf > 0 ? swim.swolf : swim.strokes.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {swim.swolf > 0 ? 'Efficiency score' : 'Total strokes'}
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => onViewDetails(swim.id)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-dark-bg/60 hover:bg-dark-bg/80 border border-dark-border/50 hover:border-primary-500/50 rounded-lg transition-all font-medium"
          >
            View Full Session Details
            <ArrowRight className={tokens.icons.sm} />
          </button>
          <button
            onClick={togglePanel}
            disabled={analysisState.loading && !analysisState.isOpen}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-blue hover:from-primary-600 hover:to-accent-blue/90 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysisState.isOpen ? (
              <>
                Close Analysis
                <ChevronUp className={tokens.icons.sm} />
              </>
            ) : (
              <>
                <Sparkles className={tokens.icons.sm} />
                Analyse My Swim
              </>
            )}
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
    </motion.div>
  );
};
