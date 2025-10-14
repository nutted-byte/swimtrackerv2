import { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

  /**
   * Load all sessions for the current user from Supabase
   */
  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('swim_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;

      setSessions(data || []);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error loading sessions:', err);
    } finally {
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
      return;
    }

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
