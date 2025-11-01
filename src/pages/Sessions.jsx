import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSwimData } from '../context/SwimDataContext';
import { SessionCard } from '../components/SessionCard';
import { MonthGroup } from '../components/MonthGroup';
import { PageContainer, PageHeader } from '../components/layout';
import { Upload, Filter, Trash2, List, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { groupSessionsByMonth } from '../utils/analytics';
import { tokens } from '../design/tokens';
import { formatDuration } from '../utils/formatters';

export const Sessions = () => {
  const navigate = useNavigate();
  const { sessions, removeSession } = useSwimData();
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, distance, pace
  const [viewMode, setViewMode] = useState('grouped'); // grouped or list
  const [allCollapsed, setAllCollapsed] = useState(true);

  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'distance':
        return b.distance - a.distance;
      case 'pace':
        return a.pace - b.pace; // Lower pace is better
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Group sessions by month
  const monthlyGroups = groupSessionsByMonth(sortedSessions);

  const handleSessionClick = (session) => {
    navigate(`/session/${session.id}`, { state: { from: '/sessions', label: 'Sessions' } });
  };

  const handleDelete = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this swim session?')) {
      removeSession(sessionId);
    }
  };

  // Calculate totals
  const totals = sessions.reduce((acc, session) => ({
    distance: acc.distance + session.distance,
    duration: acc.duration + session.duration,
    count: acc.count + 1
  }), { distance: 0, duration: 0, count: 0 });

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
            No Sessions Yet
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Upload your first swim to get started!
          </p>
          <Link
            to="/upload"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Swim Data
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="All Sessions"
        actions={
          <>
            <Link
              to="/insights"
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
      >
        {/* Stats Summary */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            {totals.count} swim{totals.count !== 1 ? 's' : ''} • {' '}
            {(totals.distance / 1000).toFixed(1)} km total • {' '}
            {formatDuration(totals.duration)}
          </p>
        </div>

        {/* Filters & View Toggle */}
        <div className="mb-6 flex flex-wrap items-center gap-4 justify-between">
          {viewMode === 'list' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Filter className="w-4 h-4" />
                <span>Sort by:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('date-desc')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    sortBy === 'date-desc'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => setSortBy('date-asc')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    sortBy === 'date-asc'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => setSortBy('distance')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    sortBy === 'distance'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Distance
                </button>
                <button
                  onClick={() => setSortBy('pace')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    sortBy === 'pace'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-card text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Fastest Pace
                </button>
              </div>
            </div>
          )}

          {/* View Mode & Collapse Toggle */}
          <div className="flex gap-2 ml-auto">
            {viewMode === 'grouped' && (
              <button
                onClick={() => setAllCollapsed(!allCollapsed)}
                className="px-3 py-2 bg-dark-card hover:bg-dark-card/80 rounded-lg text-sm transition-colors text-gray-400 hover:text-gray-200"
              >
                {allCollapsed ? 'Expand All' : 'Collapse All'}
              </button>
            )}
            <div className="flex gap-2 bg-dark-card rounded-lg p-1">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-2 ${
                  viewMode === 'grouped'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Grouped</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Display */}
        {viewMode === 'grouped' ? (
          // Grouped by Month View
          <div className="space-y-0">
            {monthlyGroups.map((monthGroup, groupIndex) => (
              <MonthGroup
                key={monthGroup.monthKey}
                monthData={monthGroup}
                previousMonthStats={groupIndex < monthlyGroups.length - 1 ? monthlyGroups[groupIndex + 1].stats : null}
                allCollapsed={allCollapsed}
              >
                {monthGroup.sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <SessionCard
                      session={session}
                      onClick={handleSessionClick}
                      allSessions={sessions}
                    />
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="absolute top-4 right-4 p-2 bg-dark-bg/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-coral/20"
                      aria-label="Delete session"
                    >
                      <Trash2 className="w-4 h-4 text-accent-coral" />
                    </button>
                  </motion.div>
                ))}
              </MonthGroup>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {sortedSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <SessionCard
                  session={session}
                  onClick={handleSessionClick}
                  allSessions={sessions}
                />
                <button
                  onClick={(e) => handleDelete(session.id, e)}
                  className="absolute top-4 right-4 p-2 bg-dark-bg/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-coral/20"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-4 h-4 text-accent-coral" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};
