import { useCallback } from 'react';

/**
 * Hook for session query/filter operations
 */
export const useSessionQueries = (sessions) => {
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

  return {
    getLastSession,
    getLastNDaysSessions
  };
};
