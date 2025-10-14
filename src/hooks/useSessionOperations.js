import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { parseSwimFile } from '../utils/fileParser';

/**
 * Hook for session CRUD operations
 */
export const useSessionOperations = (user, setSessions, setLoading, setError, loadSessions) => {
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
  }, [user, setSessions, setLoading, setError, loadSessions]);

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
  }, [user, setSessions, setError]);

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
  }, [user, setSessions, setError]);

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
  }, [user, setSessions, setError]);

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
  }, [user, setSessions, setError]);

  return {
    uploadFiles,
    addSession,
    removeSession,
    rateSession,
    clearAllSessions
  };
};
