import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { tokens } from '../../design/tokens';
import { analyzePerformanceTrends } from '../../utils/ai/llmQuery';

export const PerformanceAnalysis = ({
  sessions,
  stats,
  trends,
  milestones,
  consistencyScore,
  timeRange
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  // Generate cache key for this analysis
  const getCacheKey = () => {
    const latestSessionId = sessions.length > 0 ? sessions[sessions.length - 1].id : 'none';
    return `insights_analysis_${timeRange}_${latestSessionId}`;
  };

  // Load from cache or generate new analysis
  const loadAnalysis = async (forceRegenerate = false) => {
    setLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey();

      // Check cache unless forcing regeneration
      if (!forceRegenerate) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          // Use cache if less than 1 hour old
          if (age < 60 * 60 * 1000) {
            setAnalysis(data);
            setLoading(false);
            return;
          }
        }
      }

      // Generate new analysis
      const result = await analyzePerformanceTrends(
        sessions,
        stats,
        trends,
        milestones,
        consistencyScore,
        timeRange
      );

      if (result.success) {
        const analysisData = {
          insights: result.insights,
          usage: result.usage,
          generatedAt: new Date().toISOString()
        };

        setAnalysis(analysisData);

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: analysisData,
          timestamp: Date.now()
        }));
      } else {
        setError(result.error || 'Failed to generate analysis');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load analysis when component mounts or timeRange changes
  useEffect(() => {
    if (sessions.length > 0) {
      loadAnalysis();
    }
  }, [timeRange, sessions.length]);

  // Don't render if no sessions
  if (sessions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={tokens.margin.section}
    >
      <Card className={`${tokens.padding.section} bg-gradient-to-br from-primary-500/10 to-accent-blue/10 border border-primary-500/20`}>
        {/* Header */}
        <div className={`flex items-center justify-between ${tokens.margin.group}`}>
          <div className={`flex items-center ${tokens.gap.default}`}>
            <div className={`${tokens.padding.default} ${tokens.radius.md} bg-primary-500/20`}>
              <Sparkles className={`${tokens.icons.lg} text-primary-400`} />
            </div>
            <div>
              <h2 className={`${tokens.typography.families.display} ${tokens.typography.sizes.xl} ${tokens.typography.weights.bold} flex items-center ${tokens.gap.tight}`}>
                AI Performance Insights
                {analysis && (
                  <span className={`${tokens.typography.sizes.xs} ${tokens.typography.weights.normal} text-content-tertiary`}>
                    • {analysis.usage.inputTokens + analysis.usage.outputTokens} tokens
                  </span>
                )}
              </h2>
              <p className={`${tokens.typography.sizes.sm} text-content-tertiary`}>
                Powered by Claude AI
              </p>
            </div>
          </div>

          <div className={`flex items-center ${tokens.gap.tight}`}>
            {analysis && (
              <button
                onClick={() => loadAnalysis(true)}
                disabled={loading}
                className={`p-2 ${tokens.radius.sm} ${tokens.animation.default} transition-colors ${
                  loading
                    ? 'text-content-tertiary cursor-not-allowed'
                    : 'text-primary-400 hover:bg-primary-500/20'
                }`}
                title="Regenerate analysis"
              >
                <RefreshCw className={`${tokens.icons.sm} ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 ${tokens.radius.sm} text-content-tertiary hover:bg-dark-bg ${tokens.animation.default} transition-colors`}
            >
              {expanded ? (
                <ChevronUp className={tokens.icons.sm} />
              ) : (
                <ChevronDown className={tokens.icons.sm} />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {expanded && (
          <div className="space-y-4">
            {/* Loading state */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 bg-dark-bg/50 rounded animate-pulse"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  />
                ))}
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className={`${tokens.padding.default} bg-red-500/10 border border-red-500/30 ${tokens.radius.sm}`}>
                <p className={`${tokens.typography.sizes.sm} text-red-400`}>
                  <strong>Unable to generate AI insights:</strong> {error}
                </p>
                <Button
                  onClick={() => loadAnalysis(true)}
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Analysis content */}
            {analysis && !loading && (
              <div className="prose prose-invert max-w-none">
                <div
                  className={`${tokens.typography.sizes.sm} leading-relaxed whitespace-pre-wrap`}
                  dangerouslySetInnerHTML={{ __html: analysis.insights.replace(/\n/g, '<br/>') }}
                />

                <p className={`${tokens.typography.sizes.xs} text-content-tertiary mt-4`}>
                  Generated {new Date(analysis.generatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
