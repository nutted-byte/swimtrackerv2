import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { SwimAnalysisPanel } from './SwimAnalysisPanel';
import { Activity, TrendingUp, Clock, Target, ThumbsUp, ThumbsDown, ArrowRight, Calendar, Zap, BarChart2, TrendingDown, Flame, Sparkles, ChevronUp, BarChart3 } from 'lucide-react';
import { tokens } from '../design/tokens';
import { useSwimAnalysis } from '../hooks/useSwimAnalysis';
import { EfficiencyBadge } from './ui/EfficiencyBadge';
import { PaceComparison } from './ui/PaceComparison';
import { formatDuration } from '../utils/formatters';

export const LastSwimHero = ({ swim, sessions, onRate, onViewDetails, formatPace, deepAnalysis = null, summary = null }) => {
  const {
    analysisState,
    handleAnalyzeSwim,
    handleAskQuestion,
    toggleAnalysisPanel,
    closeAnalysisPanel
  } = useSwimAnalysis(swim, sessions);

  if (!swim) return null;

  // Calculate averages for comparison
  const avgPace = sessions.length > 1
    ? sessions.reduce((sum, s) => sum + s.pace, 0) / sessions.length
    : 0;

  const avgSwolf = sessions.filter(s => s.swolf > 0).length > 1
    ? sessions.filter(s => s.swolf > 0).reduce((sum, s) => sum + s.swolf, 0) / sessions.filter(s => s.swolf > 0).length
    : 0;

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
        {/* Header with Date */}
        <div className="mb-6">
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
            Your latest swim
          </motion.h2>
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

        {/* Efficiency & Pace Badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 flex flex-wrap gap-3"
        >
          {/* Efficiency Badge */}
          <EfficiencyBadge swolf={swim.swolf} avgSwolf={avgSwolf} />

          {/* Pacing Strategy Badge */}
          {deepAnalysis?.pacing?.strategy && (
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
          )}
        </motion.div>

        {/* Key Metrics Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 ${tokens.gap.default} mb-6`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => onViewDetails(swim.id)}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50 transition-all cursor-pointer"
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
            onClick={() => onViewDetails(swim.id)}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50 transition-all cursor-pointer"
          >
            <div className={`flex items-center ${tokens.gap.tight} text-gray-400 text-sm mb-2`}>
              <Clock className={tokens.icons.sm} />
              Duration
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {formatDuration(swim.duration)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              min:sec
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
            onClick={() => onViewDetails(swim.id)}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50 transition-all cursor-pointer"
          >
            <div className={`flex items-center ${tokens.gap.tight} text-gray-400 text-sm mb-2`}>
              <Activity className={tokens.icons.sm} />
              Pace
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>
              {formatPace(swim.pace)}
            </p>
            <p className="text-xs text-gray-500 mt-1">min/100m</p>
            {avgPace > 0 && (
              <div className="mt-2 pt-2 border-t border-dark-border/30">
                <PaceComparison currentPace={swim.pace} averagePace={avgPace} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => onViewDetails(swim.id)}
            className="bg-dark-bg/60 rounded-lg p-4 border border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50 transition-all cursor-pointer"
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
          className="flex items-center gap-3"
        >
          <button
            onClick={togglePanel}
            disabled={analysisState.loading && !analysisState.isOpen}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-blue hover:from-primary-600 hover:to-accent-blue/90 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Link
            to="/sessions"
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-bg/60 hover:bg-dark-bg/80 border border-dark-border/50 hover:border-primary-500/50 rounded-lg transition-all text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            View Sessions
          </Link>
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
