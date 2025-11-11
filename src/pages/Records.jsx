import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { NextMilestones } from '../components/NextMilestones';
import { AchievementBadges } from '../components/AchievementBadges';
import { FunComparisons } from '../components/FunComparisons';
import { PageContainer, PageHeader, PageHero } from '../components/layout';
import { Trophy, Zap, TrendingUp, Target, Calendar, Award, Sparkles, Upload, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateNextMilestones, checkAchievementBadges, generateFunComparisons } from '../utils/analytics';
import { tokens } from '../design/tokens';
import { formatDuration } from '../utils/formatters';

export const Records = () => {
  const navigate = useNavigate();
  const { sessions } = useSwimData();

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="font-display text-4xl font-bold mb-4">
            No Records Yet
          </h1>
          <p className="text-xl text-content-tertiary mb-8">
            Upload some swims to start tracking your personal bests!
          </p>
          <Link to="/upload">
            <Button>Upload Swim Data</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Find records
  const records = {
    fastestPace: sessions
      .filter(s => s.pace > 0)
      .reduce((best, s) => !best || s.pace < best.pace ? s : best, null),

    longestDistance: sessions
      .reduce((best, s) => !best || s.distance > best.distance ? s : best, null),

    bestSwolf: sessions
      .filter(s => s.swolf > 0)
      .reduce((best, s) => !best || s.swolf < best.swolf ? s : best, null),

    mostStrokes: sessions
      .filter(s => s.strokes > 0)
      .reduce((best, s) => !best || s.strokes > best.strokes ? s : best, null),

    longestDuration: sessions
      .reduce((best, s) => !best || s.duration > best.duration ? s : best, null),
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const RecordCard = ({ title, value, unit, subtitle, icon: Icon, session, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-primary-50 to-blue-50 border-primary-200',
      coral: 'from-accent-coral/20 to-accent-coral/5 border-accent-coral/30',
      teal: 'from-primary-500/20 to-primary-500/5 border-primary-500/30',
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`bg-gradient-to-br ${colorClasses[color]} cursor-pointer`}
          onClick={() => session && navigate(`/swim/${session.id}`, { state: { from: '/records', label: 'Records' } })}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 rounded-xl bg-dark-bg/50">
              <Icon className="w-8 h-8 text-accent-blue" />
            </div>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>

          <h3 className="text-sm text-content-tertiary uppercase tracking-wide mb-2">
            {title}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-2xl font-bold">{value}</span>
            {unit && <span className="text-lg text-content-tertiary">{unit}</span>}
          </div>

          {subtitle && (
            <p className="text-sm text-content-tertiary mb-4">{subtitle}</p>
          )}

          {session && (
            <div className="flex items-center gap-2 text-xs text-content-tertiary pt-4 border-t border-dark-border">
              <Calendar className="w-3 h-3" />
              {formatDate(session.date)}
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Calculate some fun stats
  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalStrokes = sessions.reduce((sum, s) => sum + s.strokes, 0);
  const avgPace = sessions.filter(s => s.pace > 0).reduce((sum, s) => sum + s.pace, 0) / sessions.filter(s => s.pace > 0).length;

  // Calculate milestones, badges, and comparisons
  const milestones = calculateNextMilestones(records, sessions);
  const badges = checkAchievementBadges(sessions, records);
  const comparisons = generateFunComparisons(sessions);

  // Calculate summary stats
  const earnedBadges = badges ? badges.filter(b => b.earned).length : 0;
  const totalBadges = badges ? badges.length : 0;
  const recordsCount = Object.values(records).filter(r => r !== null).length;

  return (
    <PageContainer>
      <PageHeader
        title="Personal Records"
        actions={
          <>
            <Link
              to="/swims"
              className="px-4 py-2 bg-dark-card hover:bg-dark-card/80 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <BarChart3 className={tokens.icons.sm} />
              <span className="hidden sm:inline">View Sessions</span>
            </Link>
            <Link to="/upload">
              <Button size="sm" leftIcon={<Upload />}>
                Upload
              </Button>
            </Link>
          </>
        }
      />

      <PageHero
        title="Your Best Performances"
        icon={Trophy}
        align="left"
      >
        {/* Summary Stats */}
        <div className={`flex items-center justify-center ${tokens.gap.compact} text-sm text-content-tertiary`}>
          <span className="flex items-center gap-2">
            <Trophy className={`${tokens.icons.sm} text-yellow-500`} />
            {recordsCount} Records
          </span>
          <span className="text-content-tertiary">•</span>
          <span className="flex items-center gap-2">
            <Award className={`${tokens.icons.sm} text-yellow-500`} />
            {earnedBadges}/{totalBadges} Badges
          </span>
          <span className="text-content-tertiary">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className={`${tokens.icons.sm} text-primary-400`} />
            {sessions.length} Swims
          </span>
        </div>
      </PageHero>

      {/* Featured Records - Top 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.default}`}>
          {records.fastestPace && (
            <RecordCard
              title="Fastest Pace"
              value={formatPace(records.fastestPace.pace)}
              unit="min/100m"
              subtitle={`${records.fastestPace.distance}m swim`}
              icon={Zap}
              session={records.fastestPace}
              color="blue"
            />
          )}

          {records.longestDistance && (
            <RecordCard
              title="Longest Swim"
              value={(records.longestDistance.distance / 1000).toFixed(2)}
              unit="km"
              subtitle={formatDuration(records.longestDistance.duration)}
              icon={TrendingUp}
              session={records.longestDistance}
              color="teal"
            />
          )}

          {records.bestSwolf && (
            <RecordCard
              title="Best SWOLF"
              value={records.bestSwolf.swolf}
              subtitle="Most efficient swim"
              icon={Target}
              session={records.bestSwolf}
              color="blue"
            />
          )}
        </div>
      </motion.div>

      {/* Achievement Badges */}
      {badges && badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AchievementBadges badges={badges} />
        </motion.div>
      )}

      {/* All-Time Stats - Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <CollapsibleSection
          title="All-Time Stats"
          subtitle={`${sessions.length} total swims`}
          icon={Award}
          defaultExpanded={false}
        >
          <div className={`grid grid-cols-1 md:grid-cols-3 ${tokens.gap.default} p-6 bg-dark-card rounded-lg`}>
            <div className="text-center p-6 bg-dark-bg rounded-lg">
              <p className="text-sm text-content-tertiary mb-2">Total Distance</p>
              <p className="font-display text-2xl font-bold text-accent-blue">
                {(totalDistance / 1000).toFixed(1)} km
              </p>
              <p className="text-xs text-content-tertiary mt-1">
                That's {Math.round(totalDistance / 25)} lengths!
              </p>
            </div>

            <div className="text-center p-6 bg-dark-bg rounded-lg">
              <p className="text-sm text-content-tertiary mb-2">Total Strokes</p>
              <p className="font-display text-2xl font-bold text-primary-400">
                {totalStrokes.toLocaleString()}
              </p>
              <p className="text-xs text-content-tertiary mt-1">
                Avg {Math.round(totalStrokes / sessions.length)} per swim
              </p>
            </div>

            <div className="text-center p-6 bg-dark-bg rounded-lg">
              <p className="text-sm text-content-tertiary mb-2">Average Pace</p>
              <p className="font-display text-2xl font-bold text-accent-blue">
                {formatPace(avgPace)}
              </p>
              <p className="text-xs text-content-tertiary mt-1">min/100m overall</p>
            </div>
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* Fun Comparisons - Collapsible */}
      {comparisons && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CollapsibleSection
            title="Fun Facts"
            subtitle="Your swimming in perspective"
            icon={Sparkles}
            defaultExpanded={false}
          >
            <FunComparisons comparisons={comparisons} />
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Click to view hint */}
      <p className="text-center text-sm text-content-tertiary mt-8">
        Click on any record to view the full session details
      </p>
    </PageContainer>
  );
};
