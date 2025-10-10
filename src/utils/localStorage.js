const STORAGE_KEY = 'swim_tracker_sessions';

/**
 * Get all swim sessions from local storage
 */
export const getSessions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save a new swim session
 */
export const saveSession = (session) => {
  try {
    const sessions = getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return session;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save session');
  }
};

/**
 * Check if a session is a duplicate
 * Two sessions are considered duplicates if they have the same date, distance, and duration
 */
const isDuplicate = (session1, session2) => {
  // Compare dates (within 1 minute tolerance for timestamp differences)
  const date1 = new Date(session1.date).getTime();
  const date2 = new Date(session2.date).getTime();
  const timeDiff = Math.abs(date1 - date2);

  return timeDiff < 60000 && // Within 1 minute
         session1.distance === session2.distance &&
         session1.duration === session2.duration;
};

/**
 * Save multiple sessions at once with deduplication
 */
export const saveSessions = (newSessions) => {
  try {
    const existingSessions = getSessions();
    const sessionsToAdd = [];
    let duplicateCount = 0;

    // Check each new session for duplicates
    for (const newSession of newSessions) {
      const isDupe = existingSessions.some(existing => isDuplicate(existing, newSession));
      if (!isDupe) {
        sessionsToAdd.push(newSession);
      } else {
        duplicateCount++;
        console.log(`Skipping duplicate session: ${newSession.date} - ${newSession.distance}m`);
      }
    }

    console.log(`Adding ${sessionsToAdd.length} new sessions, skipped ${duplicateCount} duplicates`);

    const updated = [...existingSessions, ...sessionsToAdd];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save sessions');
  }
};

/**
 * Update a session by ID
 */
export const updateSession = (sessionId, updates) => {
  try {
    const sessions = getSessions();
    const updated = sessions.map(s =>
      s.id === sessionId ? { ...s, ...updates } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating localStorage:', error);
    throw new Error('Failed to update session');
  }
};

/**
 * Delete a session by ID
 */
export const deleteSession = (sessionId) => {
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw new Error('Failed to delete session');
  }
};

/**
 * Clear all sessions
 */
export const clearSessions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    throw new Error('Failed to clear sessions');
  }
};

/**
 * Get sessions sorted by date (newest first)
 */
export const getSessionsSorted = () => {
  const sessions = getSessions();
  return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Get sessions within a date range
 */
export const getSessionsByDateRange = (startDate, endDate) => {
  const sessions = getSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

/**
 * Get sessions from the last N days
 */
export const getRecentSessions = (days = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return getSessionsByDateRange(startDate, endDate);
};
