import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getSessions,
  saveSession,
  saveSessions,
  deleteSession,
  getSessionsSorted,
  getRecentSessions
} from '../utils/localStorage';
import { parseSwimFile } from '../utils/fileParser';

const SwimDataContext = createContext();

export const SwimDataProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
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
          parsedSessions.push(sessionData);
        } catch (parseError) {
          console.error(`Error parsing ${file.name}:`, parseError);
          throw new Error(`Failed to parse ${file.name}: ${parseError.message}`);
        }
      }

      // Save to localStorage
      const updatedSessions = saveSessions(parsedSessions);
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

  const value = {
    sessions,
    loading,
    error,
    uploadFiles,
    addSession,
    removeSession,
    getLastSession,
    getLastNDaysSessions,
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
