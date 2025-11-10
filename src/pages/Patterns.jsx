import { motion } from 'framer-motion';
import { useSwimData } from '../context/SwimDataContext';
import { Card } from '../components/Card';
import { PageContainer, PageHeader } from '../components/layout';
import { Calendar, TrendingUp, Flame, BarChart3, Upload, AlertTriangle, Zap, TrendingDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from '../design/tokens';
import { formatPace, formatDate } from '../utils/formatters';
import {
  analyzeDayOfWeekPerformance,
  detectPerformanceStreaks,
  analyzeMonthlyPatterns,
} from '../utils/analytics/patternRecognition';
import { detectAnomalies, detectSuddenChanges } from '../utils/analytics/anomalyDetection';

export const Patterns = () => {
  const { sessions } = useSwimData();
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-8xl mb-6">📊</div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Pattern Analysis
          </h1>
          <p className="text-xl text-content-tertiary mb-8">
            Upload swim data to discover your performance patterns!
          </p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Swim Data
          </Link>
        </motion.div>
      </div>
    );
  }

  // Analyze patterns
  const dayOfWeekAnalysis = analyzeDayOfWeekPerformance(sessions);
  const streakAnalysis = detectPerformanceStreaks(sessions);
  const monthlyAnalysis = analyzeMonthlyPatterns(sessions);

  // Detect anomalies
  const anomalyAnalysis = detectAnomalies(sessions);
  const suddenChanges = detectSuddenChanges(sessions);

  return (
    <PageContainer>
      <PageHeader
        title="Performance Patterns"
        actions={
          <>
            <Link
              to="/insight"
              className="px-4 py-2 bg-dark-card hover:bg-dark-card/80 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <BarChart3 className={tokens.icons.sm} />
              <span className="hidden sm:inline">View Insights</span>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Current Streak */}
        {streakAnalysis.hasStreak && (
          <Card className="bg-gradient-to-br from-primary-500/10 to-accent-blue/5 border-primary-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <Flame className="w-6 h-6 text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold mb-2 capitalize">
                  {streakAnalysis.streakType} Streak!
                </h3>
                <p className="text-content-secondary mb-3">
                  {streakAnalysis.message}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 rounded-full text-sm text-primary-400">
                  <Flame className="w-4 h-4" />
                  {streakAnalysis.streakLength} swims
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Anomalies & Unusual Swims */}
        {anomalyAnalysis.hasSufficientData && anomalyAnalysis.anomalies.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="font-display text-2xl font-bold">Unusual Swims</h2>
            </div>

            <div className="space-y-3">
              {anomalyAnalysis.anomalies.slice(0, 5).map((anomaly, index) => {
                const isPositive = anomaly.direction === 'positive';
                const Icon = anomaly.type === 'pace' ? Zap : TrendingUp;

                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/swim/${anomaly.session.id}`, { state: { from: '/patterns', label: 'Patterns' } })}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                      isPositive
                        ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                        : 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${isPositive ? 'text-green-400' : 'text-yellow-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-content-secondary">
                            {formatDate(anomaly.session.date)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            anomaly.severity === 'extreme'
                              ? 'bg-primary-500/20 text-primary-400'
                              : 'bg-dark-bg text-content-tertiary'
                          }`}>
                            {anomaly.severity === 'extreme' ? 'Extreme' : 'Notable'}
                          </span>
                        </div>
                        <p className="text-sm text-content-tertiary mb-2">
                          {anomaly.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-content-tertiary">
                          <span>{(anomaly.session.distance / 1000).toFixed(2)}km</span>
                          {anomaly.session.pace > 0 && (
                            <span>{formatPace(anomaly.session.pace)} pace</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {anomalyAnalysis.anomalies.length > 5 && (
              <p className="text-sm text-content-tertiary text-center mt-4">
                + {anomalyAnalysis.anomalies.length - 5} more unusual swims
              </p>
            )}
          </Card>
        )}

        {/* Sudden Changes */}
        {suddenChanges.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-accent-coral" />
              <h2 className="font-display text-2xl font-bold">Sudden Performance Changes</h2>
            </div>

            <div className="space-y-3">
              {suddenChanges.slice(0, 3).map((change, index) => {
                const isImprovement = change.direction === 'improvement' || change.direction === 'increase';

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isImprovement
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-orange-500/10 border-orange-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {formatDate(change.previousSession.date)} → {formatDate(change.currentSession.date)}
                      </p>
                      <span className={`text-xs font-semibold ${
                        isImprovement ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {isImprovement ? '↑' : '↓'} {Math.abs(change.changePercent).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-content-tertiary">
                      {change.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Day of Week Analysis */}
        {dayOfWeekAnalysis.hasSufficientData && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-accent-blue" />
              <h2 className="font-display text-2xl font-bold">Day of Week Performance</h2>
            </div>

            {/* Day Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {dayOfWeekAnalysis.dayStats.map((dayStat) => {
                const isBest = dayOfWeekAnalysis.bestPaceDay?.day === dayStat.day;
                const isMostFrequent = dayOfWeekAnalysis.mostFrequentDay?.day === dayStat.day;

                return (
                  <div
                    key={dayStat.day}
                    className={`p-4 rounded-lg border ${
                      isBest
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-dark-card border-dark-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{dayStat.day}</p>
                      {isBest && <span className="text-xs text-green-400">⭐ Best</span>}
                      {isMostFrequent && <span className="text-xs text-primary-400">🔥 Most</span>}
                    </div>
                    <p className="text-xs text-content-tertiary mb-1">{dayStat.count} swims</p>
                    {dayStat.avgPace > 0 && (
                      <p className="text-sm font-semibold text-accent-blue">
                        {formatPace(dayStat.avgPace)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Insights */}
            {dayOfWeekAnalysis.insights.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-content-tertiary">Insights:</p>
                {dayOfWeekAnalysis.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-dark-bg rounded-lg"
                  >
                    <div className="text-xl">
                      {insight.type === 'pace' ? '⚡' :
                       insight.type === 'frequency' ? '📅' : '📊'}
                    </div>
                    <p className="text-sm text-content-secondary">{insight.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Monthly Patterns */}
        {monthlyAnalysis.hasSufficientData && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-accent-blue" />
              <h2 className="font-display text-2xl font-bold">Monthly Patterns</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {monthlyAnalysis.bestMonth && (
                <div className="p-4 bg-dark-bg rounded-lg">
                  <p className="text-sm text-content-tertiary mb-2">Best Month (Pace)</p>
                  <p className="font-display text-2xl font-bold text-accent-blue mb-1">
                    {new Date(monthlyAnalysis.bestMonth.month + '-01').toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-content-tertiary">
                    {formatPace(monthlyAnalysis.bestMonth.avgPace)} avg pace
                  </p>
                </div>
              )}

              {monthlyAnalysis.mostActiveMonth && (
                <div className="p-4 bg-dark-bg rounded-lg">
                  <p className="text-sm text-content-tertiary mb-2">Most Active Month</p>
                  <p className="font-display text-2xl font-bold text-primary-400 mb-1">
                    {new Date(monthlyAnalysis.mostActiveMonth.month + '-01').toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-content-tertiary">
                    {monthlyAnalysis.mostActiveMonth.count} swims
                  </p>
                </div>
              )}
            </div>

            {/* Monthly timeline */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-content-tertiary mb-3">Activity Timeline:</p>
              {monthlyAnalysis.monthStats.slice(-6).map((month) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="text-xs text-content-tertiary w-24">
                    {new Date(month.month + '-01').toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex-1 bg-dark-bg rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-blue h-full flex items-center px-2"
                      style={{ width: `${Math.min(100, (month.count / 8) * 100)}%` }}
                    >
                      <span className="text-xs font-medium whitespace-nowrap">
                        {month.count} swims
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Data Insufficient Message */}
        {!dayOfWeekAnalysis.hasSufficientData && !monthlyAnalysis.hasSufficientData && (
          <Card>
            <div className="text-center py-8">
              <p className="text-xl text-content-tertiary mb-2">Not Enough Data Yet</p>
              <p className="text-sm text-content-tertiary">
                Upload more swim sessions to see detailed pattern analysis!
              </p>
            </div>
          </Card>
        )}
      </motion.div>
    </PageContainer>
  );
};
