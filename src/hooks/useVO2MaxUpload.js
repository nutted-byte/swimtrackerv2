import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { parseVO2MaxFile } from '../utils/fileParser';

/**
 * Hook for VO2 max data upload functionality
 */
export const useVO2MaxUpload = (user, sessions, setLoading, setError, loadSessions) => {
  /**
   * Upload VO2 max data from CSV and match to existing sessions by date
   */
  const uploadVO2MaxData = useCallback(async (file) => {
    if (!user) {
      throw new Error('User must be authenticated to upload VO2 max data');
    }

    setLoading(true);
    setError(null);

    try {
      // Parse the VO2 max CSV file
      const vo2MaxData = await parseVO2MaxFile(file);
      console.log(`Parsed ${vo2MaxData.length} VO2 max entries`);

      // Sort VO2 max data by date (oldest to newest)
      const sortedVO2Max = [...vo2MaxData].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
      );

      let matchedCount = 0;

      // For each session, find the most recent VO2 max reading before or on that date
      for (const session of sessions) {
        const sessionDate = new Date(session.date);

        // Find the most recent VO2 max entry on or before this session
        let mostRecentVO2Max = null;
        for (const entry of sortedVO2Max) {
          const entryDate = new Date(entry.date);
          if (entryDate <= sessionDate) {
            mostRecentVO2Max = entry;
          } else {
            break; // Since sorted, no need to check further
          }
        }

        if (mostRecentVO2Max) {
          const { error: updateError } = await supabase
            .from('swim_sessions')
            .update({ vo2max: mostRecentVO2Max.vo2max })
            .eq('id', session.id)
            .eq('user_id', user.id);

          if (updateError) {
            console.error(`Failed to update session ${session.id}:`, updateError);
          } else {
            matchedCount++;
          }
        }
      }

      // Reload sessions to get updated data
      await loadSessions();

      return {
        success: true,
        matchedCount,
        totalEntries: vo2MaxData.length,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, sessions, setLoading, setError, loadSessions]);

  return {
    uploadVO2MaxData
  };
};
