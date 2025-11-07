import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { SwimAnalysisPanel } from './SwimAnalysisPanel';
import { Activity, TrendingUp, Clock, Target, ThumbsUp, ThumbsDown, ArrowRight, Calendar, Zap, BarChart2, TrendingDown, Flame, Sparkles, ChevronUp, BarChart3 } from 'lucide-react';
import { tokens } from '../design/tokens';
import { useSwimAnalysis } from '../hooks/useSwimAnalysis';
import { EfficiencyBadge } from './ui/EfficiencyBadge';
import { PaceComparison } from './ui/PaceComparison';
import { DPSBadge } from './ui/DPSBadge';
import { DPSComparison } from './ui/DPSComparison';
import { formatDuration } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';
import { calculateDPS, calculateAverageDPS } from '../utils/strokeEfficiency';
import { ShareButton } from './sharing/ShareButton';
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

  // Calculate averages for comparison
  const avgPace = sessions.length > 1
    ? sessions.reduce((sum, s) => sum + s.pace, 0) / sessions.length
    : 0;

  const avgSwolf = sessions.filter(s => s.swolf > 0).length > 1
    ? sessions.filter(s => s.swolf > 0).reduce((sum, s) => sum + s.swolf, 0) / sessions.filter(s => s.swolf > 0).length
    : 0;

  // Calculate DPS for current swim and average
  const currentDPS = calculateDPS(swim);
  const avgDPS = calculateAverageDPS(sessions);

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
        bg-gradient-to-br border
        ${isDark
          ? 'from-primary-500/15 to-accent-blue/10 border-primary-500/30'
          : 'from-primary-50 to-blue-50 border-primary-200'
        }
      `}>
        {/* Header with Date */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className={`${tokens.icons.md} ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              {fullDate} • {swimTime}
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`${tokens.typography.families.display} ${tokens.typography.sizes['3xl']} ${tokens.typography.weights.bold} ${isDark ? 'text-primary-400' : 'text-primary-700'}`}
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
            <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
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

          {/* DPS Badge */}
          {currentDPS > 0 && (
            <DPSBadge dps={currentDPS} />
          )}

          {/* Pacing Strategy Badge */}
          {deepAnalysis?.pacing?.strategy && (
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg border
              ${isDark ? 'bg-dark-bg/60 border-dark-border/50' : 'bg-white border-slate-200'}
            `}>
              {deepAnalysis.pacing.strategy === 'negative' && (
                <>
                  <Zap className={`${tokens.icons.sm} text-accent-blue`} />
                  <span className="text-sm font-medium text-accent-blue">Negative Split</span>
                </>
              )}
              {deepAnalysis.pacing.strategy === 'even' && (
                <>
                  <BarChart2 className={`${tokens.icons.sm} ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Even Pace</span>
                </>
              )}
              {deepAnalysis.pacing.strategy === 'positive' && (
                <>
                  <TrendingDown className={`${tokens.icons.sm} ${isDark ? 'text-gray-400' : 'text-slate-500'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Positive Split</span>
                </>
              )}
              <span className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
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
            className={`
              rounded-lg p-4 border transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-primary-400 shadow-sm'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              <TrendingUp className={tokens.icons.sm} />
              Distance
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {(swim.distance / 1000).toFixed(2)} km
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
              {Math.round(swim.distance / 25)} lengths
            </p>
            {currentDPS > 0 && avgDPS > 0 && (
              <div className={`mt-2 pt-2 border-t ${isDark ? 'border-dark-border/30' : 'border-slate-200'}`}>
                <DPSComparison currentDPS={currentDPS} averageDPS={avgDPS} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 border transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-primary-400 shadow-sm'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              <Clock className={tokens.icons.sm} />
              Duration
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}>
              {formatDuration(swim.duration)}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
              min:sec
            </p>
            {swim.calories > 0 && (
              <div className={`mt-2 pt-2 border-t flex items-center gap-1.5 ${isDark ? 'border-dark-border/30' : 'border-slate-200'}`}>
                <Flame className="w-3 h-3 text-accent-coral" />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{swim.calories} cal</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 border transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-primary-400 shadow-sm'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              <Activity className={tokens.icons.sm} />
              Pace
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} text-accent-blue`}>
              {formatPace(swim.pace)}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>min/100m</p>
            {avgPace > 0 && (
              <div className={`mt-2 pt-2 border-t ${isDark ? 'border-dark-border/30' : 'border-slate-200'}`}>
                <PaceComparison currentPace={swim.pace} averagePace={avgPace} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => onViewDetails(swim.id)}
            className={`
              rounded-lg p-4 border transition-all cursor-pointer
              ${isDark
                ? 'bg-dark-bg/60 border-dark-border/50 hover:bg-dark-bg/80 hover:border-primary-500/50'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-primary-400 shadow-sm'
              }
            `}
          >
            <div className={`flex items-center ${tokens.gap.tight} text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              <Target className={tokens.icons.sm} />
              {swim.swolf > 0 ? 'SWOLF' : 'Strokes'}
            </div>
            <p className={`${tokens.typography.families.display} ${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold} ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              {swim.swolf > 0 ? swim.swolf : swim.strokes.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
              {swim.swolf > 0 ? 'Efficiency score' : 'Total strokes'}
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center gap-3"
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
                <span className="hidden sm:inline">Analyse My Swim</span>
                <span className="sm:hidden">Analyse</span>
              </>
            )}
          </button>
          <Link
            to="/swims"
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium border
              ${isDark
                ? 'bg-dark-bg/60 hover:bg-dark-bg/80 border-dark-border/50 hover:border-primary-500/50'
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-primary-400 shadow-sm'
              }
            `}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">View All Swims</span>
            <span className="sm:hidden">Swims</span>
          </Link>
          <ShareButton
            onClick={() => setShareModalOpen(true)}
            variant="ghost"
            size="md"
          >
            Share
          </ShareButton>
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
