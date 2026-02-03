import { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { hasLocalStorageData, migrateLocalStorageToSupabase } from '../utils/migration';
import { useSessionOperations } from '../hooks/useSessionOperations';
import { useVO2MaxUpload } from '../hooks/useVO2MaxUpload';
import { useSessionQueries } from '../hooks/useSessionQueries';

const SwimDataContext = createContext();

export const SwimDataProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const loadedForUser = useRef(null); // Cache: track which user we've loaded data for

  /**
   * Load recent sessions first (90 days), then load older sessions in background
   */
  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date 90 days ago
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // First, load recent sessions (last 90 days) - FAST
      const { data: recentData, error: recentError } = await supabase
        .from('swim_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', ninetyDaysAgo.toISOString())
        .order('date', { ascending: false });

      if (recentError) throw recentError;

      // Set recent sessions immediately so UI can render
      setSessions(recentData || []);
      setLoading(false); // UI is ready!

      // Then, load older sessions in the background
      const { data: olderData, error: olderError } = await supabase
        .from('swim_sessions')
        .select('*')
        .eq('user_id', user.id)
        .lt('date', ninetyDaysAgo.toISOString())
        .order('date', { ascending: false });

      if (!olderError && olderData && olderData.length > 0) {
        // Merge older sessions with recent ones
        setSessions(prev => [...prev, ...olderData]);
      }

    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error loading sessions:', err);
      setLoading(false);
    }
  };

  /**
   * Initialize data - check for migration needs and load sessions
   */
  const initializeData = async () => {
    try {
      setLoading(true);

      // Check if we need to migrate localStorage data
      if (hasLocalStorageData()) {
        console.log('Found localStorage data, starting migration...');
        setMigrationStatus('migrating');

        const result = await migrateLocalStorageToSupabase(user.id);

        if (result.success) {
          setMigrationStatus('success');
          console.log(`Migration successful: ${result.message}`);
        } else {
          setMigrationStatus('failed');
          console.error(`Migration failed: ${result.message}`);
        }
      }

      // Load sessions from Supabase
      await loadSessions();
    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Failed to initialize data');
    } finally {
      setLoading(false);
    }
  };

  // Load sessions from Supabase when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSessions([]);
      setLoading(false);
      loadedForUser.current = null;
      return;
    }

    // Cache: only load if we haven't loaded for this user yet
    if (loadedForUser.current === user.id) {
      setLoading(false); // Already loaded, no need to fetch again
      return;
    }

    loadedForUser.current = user.id;
    initializeData();
  }, [user, isAuthenticated]);

  // Use custom hooks for operations
  const sessionOps = useSessionOperations(user, setSessions, setLoading, setError, loadSessions);
  const vo2MaxOps = useVO2MaxUpload(user, sessions, setLoading, setError, loadSessions);
  const sessionQueries = useSessionQueries(sessions);

  const value = useMemo(() => ({
    sessions,
    loading,
    error,
    migrationStatus,
    loadSessions,
    ...sessionOps,
    ...vo2MaxOps,
    ...sessionQueries,
  }), [
    sessions,
    loading,
    error,
    migrationStatus,
    sessionOps,
    vo2MaxOps,
    sessionQueries,
  ]);

  return (
    <SwimDataContext.Provider value={value}>
      {children}
    </SwimDataContext.Provider>
  );
};

export const useSwimData = () => {
  const context = useContext(SwimDataContext);
  if (!context) {
    throw new Error('useSwimData must be used within SwimDataProvider');
  }
  return context;
};
