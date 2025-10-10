import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { DeepInsightCard } from '../components/DeepInsightCard';
import { ProgressBreakdown } from '../components/ProgressBreakdown';
import { QuickInsightCard } from '../components/QuickInsightCard';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { LastSwimHero } from '../components/LastSwimHero';
import { SwimRankingCard } from '../components/SwimRankingCard';
import { SwimComparisonGrid } from '../components/SwimComparisonGrid';
import { SwimInterrogator } from '../components/SwimInterrogator';
import { PageContainer, PageHeader } from '../components/layout';
import { Activity, TrendingUp, Zap, Upload, BarChart3, Sparkles, TrendingDown, MessageCircle } from 'lucide-react';
import { useSwimData } from '../context/SwimDataContext';
import {
  analyzeProgress,
  generateCoachingInsight,
  analyzeLastSwimDeep,
  calculateSwimRanking,
  generateSwimQuestions,
  answerSwimQuestion,
  generateSwimSummary
} from '../utils/analytics';
import { tokens } from '../design/tokens';

export const Dashboard = () => {
  const { sessions, rateSession } = useSwimData();
  const navigate = useNavigate();

  // Analyze progress from real data
  const analysis = analyzeProgress(sessions, 30);
  const coachingInsight = generateCoachingInsight(analysis);

  const { status, message, improving, metrics } = analysis;

  // Get the most recent swim
  const lastSwim = sessions[0] || null;

  // Deep analysis of last swim
  const deepAnalysis = lastSwim ? analyzeLastSwimDeep(lastSwim, sessions) : null;

  // Calculate ranking for last swim
  const ranking = lastSwim ? calculateSwimRanking(lastSwim, sessions) : null;

  // Generate questions for swim interrogator
  const questions = lastSwim && deepAnalysis ? generateSwimQuestions(lastSwim, deepAnalysis, sessions) : [];

  // Generate answers for all questions
  const answers = {};
  questions.forEach(q => {
    try {
      answers[q.id] = answerSwimQuestion(q.id, lastSwim, deepAnalysis, ranking, sessions);
    } catch (err) {
      console.error(`Error generating answer for ${q.id}:`, err);
      answers[q.id] = 'Unable to generate answer for this question.';
    }
  });

  // Generate swim summary
  const swimSummary = lastSwim ? generateSwimSummary(lastSwim, deepAnalysis, ranking, sessions) : null;

  // Emoji based on status
  const statusEmoji = {
    'improving': '✅',
    'stable': '⚡',
    'declining': '⚠️',
    'no-data': '📊',
    'insufficient-data': '📈'
  };

  // If no data, show empty state
  if (status === 'no-data' || status === 'insufficient-data') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">🌊</div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Welcome to Swimma!
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {message}
          </p>
          <Link
            to="/upload"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Swim
          </Link>
        </motion.div>
      </div>
    );
  }

  // Format pace for display (convert decimal to min:sec)
  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get top recommendation from deep analysis
  const topRecommendation = deepAnalysis?.recommendations?.[0] || null;

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        actions={
          <>
            <Link
              to="/sessions"
              className="px-4 py-2 bg-dark-card hover:bg-dark-card/80 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <BarChart3 className={tokens.icons.sm} />
              <span className="hidden sm:inline">View Sessions</span>
            </Link>
            <Link
              to="/upload"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Upload className={tokens.icons.sm} />
              Upload
            </Link>
          </>
        }
      />

      {/* 1. Last Swim Hero - MOST PROMINENT */}
      {lastSwim && (
        <LastSwimHero
          swim={lastSwim}
          onRate={rateSession}
          onViewDetails={(id) => navigate(`/session/${id}`, { state: { from: '/', label: 'Dashboard' } })}
          formatPace={formatPace}
          deepAnalysis={deepAnalysis}
          summary={swimSummary}
        />
      )}

      {/* 2. Swim Ranking Card */}
      {ranking && (
        <SwimRankingCard ranking={ranking} />
      )}

      {/* 3. Swim Comparison Grid */}
      {deepAnalysis?.comparative && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SwimComparisonGrid
            lastSwim={lastSwim}
            comparative={deepAnalysis.comparative}
            formatPace={formatPace}
          />
        </motion.div>
      )}

      {/* 4. Swim Interrogator - Interactive Q&A */}
      {questions.length > 0 && (
        <SwimInterrogator
          questions={questions}
          answers={answers}
        />
      )}

      {/* 5. Coaching Insights */}
      {topRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuickInsightCard recommendation={topRecommendation} />
        </motion.div>
      )}

      {/* Simple coach insight if no recommendation */}
      {!topRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏊</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Coach's Insight
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {coachingInsight}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 6. Progress Overview - Collapsible (moved down) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <CollapsibleSection
          title="Am I Getting Better?"
          subtitle={message}
          icon={TrendingUp}
          defaultExpanded={false}
        >
          {/* Progress Breakdown */}
          <div className="mb-6">
            <ProgressBreakdown analysis={analysis} />
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.default}`}>
            <StatCard
              label="Average Pace"
              value={formatPace(metrics.avgPace)}
              unit="min/100m"
              trend={metrics.trends.pace}
              icon={Activity}
              glow={metrics.trends.pace > 0}
            />
            <StatCard
              label="SWOLF"
              value={Math.round(metrics.avgSwolf)}
              trend={metrics.trends.swolf}
              icon={Zap}
              glow={metrics.trends.swolf > 0}
            />
            <StatCard
              label="Total Distance"
              value={(metrics.totalDistance / 1000).toFixed(1)}
              unit="km"
              trend={metrics.trends.distance}
              icon={TrendingUp}
            />
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* 7. Deep Analysis - Collapsible */}
      {deepAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CollapsibleSection
            title="Deep Analysis"
            subtitle={`${deepAnalysis.recommendations?.length || 0} insights & recommendations`}
            icon={Sparkles}
            badge={deepAnalysis.recommendations?.length || 0}
            defaultExpanded={false}
          >
            <DeepInsightCard analysis={deepAnalysis} />
          </CollapsibleSection>
        </motion.div>
      )}
    </PageContainer>
  );
};
