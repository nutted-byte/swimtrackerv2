import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getSessions,
  saveSession,
  saveSessions,
  updateSession,
  deleteSession,
  clearSessions,
  getSessionsSorted,
  getRecentSessions
} from '../utils/localStorage';
import { parseSwimFile } from '../utils/fileParser';
import { ensureTestData } from '../utils/testData';

const SwimDataContext = createContext();

export const SwimDataProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      // In development, auto-load test data if none exists
      if (import.meta.env.DEV) {
        ensureTestData();
      }

      const storedSessions = getSessionsSorted();
      setSessions(storedSessions);
    } catch (err) {
      setError('Failed to load sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload and parse new swim files
   */
  const uploadFiles = useCallback(async (files) => {
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

      // Save to localStorage
      const updatedSessions = saveSessions(parsedSessions);
      console.log(`Total sessions in storage: ${updatedSessions.length}`);
      setSessions(updatedSessions);

      return parsedSessions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a single session manually
   */
  const addSession = useCallback((sessionData) => {
    try {
      const newSession = saveSession(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      setError('Failed to add session');
      throw err;
    }
  }, []);

  /**
   * Remove a session
   */
  const removeSession = useCallback((sessionId) => {
    try {
      const updatedSessions = deleteSession(sessionId);
      setSessions(updatedSessions);
    } catch (err) {
      setError('Failed to delete session');
      throw err;
    }
  }, []);

  /**
   * Rate a session (thumbs up = true, thumbs down = false, null = no rating)
   */
  const rateSession = useCallback((sessionId, rating) => {
    try {
      const updatedSessions = updateSession(sessionId, { rating });
      setSessions(updatedSessions);
    } catch (err) {
      setError('Failed to rate session');
      throw err;
    }
  }, []);

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
    return getRecentSessions(days);
  }, []);

  /**
   * Clear all sessions
   */
  const clearAllSessions = useCallback(() => {
    try {
      clearSessions();
      setSessions([]);
    } catch (err) {
      setError('Failed to clear sessions');
      throw err;
    }
  }, []);

  const value = {
    sessions,
    loading,
    error,
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
