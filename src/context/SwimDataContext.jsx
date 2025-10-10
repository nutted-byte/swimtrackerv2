import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { parseSwimFile } from '../utils/fileParser';
import { hasLocalStorageData, migrateLocalStorageToSupabase } from '../utils/migration';

const SwimDataContext = createContext();

export const SwimDataProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Load sessions from Supabase when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    initializeData();
  }, [user, isAuthenticated]);

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
   * Upload and parse new swim files
   */
  const uploadFiles = useCallback(async (files) => {
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    setLoading(true);
    setError(null);

    try {
      const parsedSessions = [];

      for (const file of files) {
        try {
          const sessionData = await parseSwimFile(file);
          console.log(`Parsed ${file.name}:`, sessionData);

          // Handle both single sessions and arrays (CSV returns array)
          if (Array.isArray(sessionData)) {
            console.log(`CSV file contained ${sessionData.length} sessions`);
            parsedSessions.push(...sessionData);
          } else {
            console.log('Single session parsed');
            parsedSessions.push(sessionData);
          }
        } catch (parseError) {
          console.error(`Error parsing ${file.name}:`, parseError);
          throw new Error(`Failed to parse ${file.name}: ${parseError.message}`);
        }
      }

      console.log(`Total parsed sessions: ${parsedSessions.length}`);

      // Prepare sessions for Supabase (add user_id, remove old id)
      const sessionsToInsert = parsedSessions.map(session => {
        const { id, ...sessionWithoutId } = session;
        return {
          ...sessionWithoutId,
          user_id: user.id,
        };
      });

      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('swim_sessions')
        .insert(sessionsToInsert)
        .select();

      if (insertError) throw insertError;

      console.log(`Successfully inserted ${data.length} sessions`);

      // Reload sessions
      await loadSessions();

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Add a single session manually
   */
  const addSession = useCallback(async (sessionData) => {
    if (!user) {
      throw new Error('User must be authenticated to add sessions');
    }

    try {
      const { id, ...sessionWithoutId } = sessionData;
      const sessionToInsert = {
        ...sessionWithoutId,
        user_id: user.id,
      };

      const { data, error: insertError } = await supabase
        .from('swim_sessions')
        .insert([sessionToInsert])
        .select()
        .single();

      if (insertError) throw insertError;

      setSessions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError('Failed to add session');
      console.error('Error adding session:', err);
      throw err;
    }
  }, [user]);

  /**
   * Remove a session
   */
  const removeSession = useCallback(async (sessionId) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('swim_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      setError('Failed to delete session');
      console.error('Error deleting session:', err);
      throw err;
    }
  }, [user]);

  /**
   * Rate a session (thumbs up = true, thumbs down = false, null = no rating)
   */
  const rateSession = useCallback(async (sessionId, rating) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('swim_sessions')
        .update({ rating })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setSessions(prev => prev.map(s => s.id === sessionId ? data : s));
    } catch (err) {
      setError('Failed to rate session');
      console.error('Error rating session:', err);
      throw err;
    }
  }, [user]);

  /**
   * Get the most recent session
   */
  const getLastSession = useCallback(() => {
    return sessions[0] || null;
  }, [sessions]);

  /**
   * Get sessions from last N days
   */
  const getLastNDaysSessions = useCallback((days = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }, [sessions]);

  /**
   * Clear all sessions for the current user
   */
  const clearAllSessions = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('swim_sessions')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setSessions([]);
    } catch (err) {
      setError('Failed to clear sessions');
      console.error('Error clearing sessions:', err);
      throw err;
    }
  }, [user]);

  const value = {
    sessions,
    loading,
    error,
    migrationStatus,
    uploadFiles,
    addSession,
    removeSession,
    rateSession,
    getLastSession,
    getLastNDaysSessions,
    clearAllSessions,
  };

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
