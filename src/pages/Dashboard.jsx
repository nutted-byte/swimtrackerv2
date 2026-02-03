import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Separator } from '../components/primitives';
import { StatCard } from '../components/StatCard';
import { DeepInsightCard } from '../components/DeepInsightCard';
import { ProgressBreakdown } from '../components/ProgressBreakdown';
import { QuickInsightCard } from '../components/QuickInsightCard';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { LastSwimHero } from '../components/LastSwimHero';
import { SwimRankingCard } from '../components/SwimRankingCard';
import { SwimComparisonGrid } from '../components/SwimComparisonGrid';
import { SwimInterrogator } from '../components/SwimInterrogator';
import { SessionCard } from '../components/SessionCard';
import { PageContainer, PageHeader } from '../components/layout';
import { Button } from '../components/Button';
import { Activity, TrendingUp, Zap, Upload, BarChart3, Sparkles, TrendingDown, MessageCircle, ArrowRight } from 'lucide-react';
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
import { getTechniqueRecommendation, shouldShowTechniqueTips } from '../utils/techniqueRecommendations';
import { TechniqueCard } from '../components/TechniqueCard';
import { ProgressCard } from '../components/dashboard/ProgressCard';
import { TrainingPlanCard } from '../components/dashboard/TrainingPlanCard';
import { StreakCard } from '../components/dashboard/StreakCard';
import { PaceTrendCard } from '../components/dashboard/PaceTrendCard';
import { AIAssistantCard } from '../components/dashboard/AIAssistantCard';
import { RecentSwimsTrend } from '../components/dashboard/RecentSwimsTrend';
import { HeroSkeleton, CardGridSkeleton, StatCardSkeleton } from '../components/LoadingSkeletons';

export const Dashboard = () => {
  const { sessions, rateSession, removeSession, loading } = useSwimData();
  const navigate = useNavigate();

  // Memoize expensive calculations to prevent re-computation on every render
  // Analyze progress from real data
  const analysis = useMemo(() => analyzeProgress(sessions, 30), [sessions]);
  const coachingInsight = useMemo(() => generateCoachingInsight(analysis, sessions), [analysis, sessions]);

  const { status, message, improving, metrics } = analysis;

  // Get the most recent swim
  const lastSwim = useMemo(() => sessions[0] || null, [sessions]);

  // Deep analysis of last swim
  const deepAnalysis = useMemo(
    () => (lastSwim ? analyzeLastSwimDeep(lastSwim, sessions) : null),
    [lastSwim, sessions]
  );

  // Calculate ranking for last swim
  const ranking = useMemo(
    () => (lastSwim ? calculateSwimRanking(lastSwim, sessions) : null),
    [lastSwim, sessions]
  );

  // Generate questions for swim interrogator
  const questions = useMemo(
    () => (lastSwim && deepAnalysis ? generateSwimQuestions(lastSwim, deepAnalysis, sessions) : []),
    [lastSwim, deepAnalysis, sessions]
  );

  // Generate answers for all questions
  const answers = useMemo(() => {
    const answersObj = {};
    questions.forEach(q => {
      try {
        answersObj[q.id] = answerSwimQuestion(q.id, lastSwim, deepAnalysis, ranking, sessions);
      } catch (err) {
        console.error(`Error generating answer for ${q.id}:`, err);
        answersObj[q.id] = 'Unable to generate answer for this question.';
      }
    });
    return answersObj;
  }, [questions, lastSwim, deepAnalysis, ranking, sessions]);

  // Generate swim summary
  const swimSummary = useMemo(
    () => (lastSwim ? generateSwimSummary(lastSwim, deepAnalysis, ranking, sessions) : null),
    [lastSwim, deepAnalysis, ranking, sessions]
  );

  // Get recent sessions (last 3 months) - MUST be before early return
  const recentSessions = useMemo(() => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return sessions.filter(session =>
      new Date(session.date) >= threeMonthsAgo
    ).slice(0, 10); // Show max 10 sessions
  }, [sessions]);

  // Get technique recommendation
  const techniqueRecommendation = useMemo(() => {
    // TODO: Get user preferences from context (wellness mode)
    const userPreferences = {}; // Placeholder
    if (!shouldShowTechniqueTips(userPreferences)) {
      return null;
    }
    return getTechniqueRecommendation(lastSwim, sessions);
  }, [lastSwim, sessions]);

  // Emoji based on status
  const statusEmoji = {
    'improving': '✅',
    'stable': '⚡',
    'declining': '⚠️',
    'no-data': '📊',
    'insufficient-data': '📈'
  };

  // Show loading skeletons
  if (loading && sessions.length === 0) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <HeroSkeleton />
          <StatCardSkeleton />
          <CardGridSkeleton count={2} />
        </div>
      </PageContainer>
    );
  }

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
          <h1 className={`${tokens.typography.families.display} ${tokens.typography.sizes['4xl']} ${tokens.typography.weights.bold} mb-4`}>
            Welcome to Swimma!
          </h1>
          <p className={`${tokens.typography.sizes.xl} text-content-tertiary mb-8`}>
            {message}
          </p>
          <Link to="/upload">
            <Button leftIcon={<Upload />}>
              Upload Your First Swim
            </Button>
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

  const handleSessionClick = (session) => {
    navigate(`/swim/${session.id}`, { state: { from: '/', label: 'Home' } });
  };

  const handleDelete = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this swim session?')) {
      removeSession(sessionId);
    }
  };

  return (
    <PageContainer>

      {/* 1. Last Swim Hero - MOST PROMINENT */}
      {lastSwim && (
        <LastSwimHero
          swim={lastSwim}
          sessions={sessions}
          onRate={rateSession}
          onViewDetails={(id) => navigate(`/swim/${id}`, { state: { from: '/', label: 'Home' } })}
          formatPace={formatPace}
          deepAnalysis={deepAnalysis}
          summary={swimSummary}
        />
      )}

      {/* 2. Monthly Streak */}
      {sessions.length > 0 && (
        <StreakCard sessions={sessions} />
      )}

      {/* 3. Recent Swims */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold">Recent Swims</h2>
              <Link
                to="/swims"
                className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors group"
              >
                <span>View all swims</span>
                <ArrowRight className={`${tokens.icons.sm} group-hover:translate-x-1 transition-transform`} />
              </Link>
            </div>

            {/* Trend Sparkline */}
            <RecentSwimsTrend sessions={recentSessions} />

            <div className="space-y-2">
              {recentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SessionCard
                    session={session}
                    onClick={() => handleSessionClick(session)}
                    onDelete={(e) => handleDelete(session.id, e)}
                    onRate={rateSession}
                    formatPace={formatPace}
                    allSessions={sessions}
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* 4. Training Plan */}
      <TrainingPlanCard />

      {/* 5. Technique Recommendation */}
      {techniqueRecommendation && (
        <TechniqueCard recommendation={techniqueRecommendation} />
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12"
      >
        <Separator spacing="lg" />
        <div className="text-center flex items-center justify-center gap-4">
          <Link
            to="/how-it-works"
            className="text-sm text-content-tertiary hover:text-primary-400 transition-colors"
          >
            How It Works
          </Link>
          <span className="text-content-tertiary">•</span>
          <Link
            to="/components"
            className="text-sm text-content-tertiary hover:text-primary-400 transition-colors"
          >
            Component Showcase
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  );
};
